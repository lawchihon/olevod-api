const _ = require('lodash');
const cheerio = require('cheerio');
const jc = require('@johman/constants');
const jh = require('@johman/helper');
const axios = require('axios');
const vm = require('vm');

const c = require('./constants.js');
const userAgent = 'Mozilla: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/43.4';

const olevodInstance = axios.create({
  baseURL: c.BASE_URL,
  headers: {
    origin: c.BASE_URL,
    referer: c.BASE_URL,
    'upgrade-insecure-requests': 1,
    'user-agent': userAgent
  }
});

const getResponse = async (instance, options, retry = 0) => {
  if (retry > 4) return Promise.reject('Failed to get response');
  try {
    const response = await instance(options);
    if (!response.data || !response.data.includes('window.location=url')) {
      return response;
    }
    const context = {};
    vm.createContext(context);
    vm.runInContext(`var url=${response.data.extractBetween('var url=', 'window.location=url')}`, context);
    options.url = c.BASE_URL + context.url;
  } catch (err) {
    console.log(err);
    await jh.delay(1000 * Math.min(Math.random() * 2 + 1, 2));
  }
  return getResponse(instance, options, retry + 1);
};

const parseDetailId = (link) => {
  return link && link.replace(/\/index\.php\/vod\/detail\/id\/|.html/g, '')
};

const parsePlayId = (link) => {
  return link && link.replace(/\/index\.php\/vod\/play\/id\/|.html/g, '').replace(/\/sid\/|\/nid\//g, '-');
};

const parseVideoResult = (element) => {
  const img = element.find('.vodlist_thumb');
  const imgLink = img.attr('data-original') || img.attr('src');
  const result = {
    detailId: parseDetailId(img.attr('href')),
    title: img.attr('title'),
    picture: imgLink ? `${c.BASE_URL}${imgLink}` : undefined,
    // scores: element.find('.text_dy').text().trim()
  };

  return jh.compactObject(result);
};

const parseDetail = (html) => {
  const $ = cheerio.load(html);
  const thumb = $('.content_thumb > .vodlist_thumb, .play_vlist > .play_vlist_thumb').first();
  const thumbLink = thumb.attr('data-original');
  const result = {
    detailId: thumb.attr('dids'),
    title: $('h2.title').text().trim(),
    scores: $('.star_tips, .text_score').text().trim(),
    picture: thumbLink ? c.BASE_URL + thumb.attr('data-original') : undefined,
    description: $('.content_desc > span:first-child, .play_content > p:last-child').text().trim()
  };

  result.playInfos = [];
  $('.playlist_full').last().find('a').each((i, elem) => {
    result.playInfos.push(parsePlayInfo($(elem)));
  });

  return jh.compactObject(result);
};

const parsePlayInfo = (element) => {
  const result = {
    playId: parsePlayId(element.attr('href')),
    title: element.text()
  };
  return jh.compactObject(result);
};

const parseTypeId = (link) => {
  return link
    && link.extractBetween('/id/', '/').replace('.html', '');
};

const getTypeFilters = (instance, typeId) => {
  const vod = typeId ? `show/id/${typeId}` : 'search';

  const options = {
    method: 'GET',
    url: `${c.BASE_URL}/index.php/vod/show/id/${typeId}.html`,
  }

  return getResponse(instance, options)
    .then(response => {
      const $ = cheerio.load(response.data);
      const filters = {};
      $('.wrapper_fl').each((i, elem) => {
        let linkKey;
        const filterValues = [];

        switch (i) {
          case 0:
            filters.types = filterValues;
            linkKey = 'id';
            break;
          case 1:
            filters.areas = filterValues;
            linkKey = 'area';
            break;
          case 2:
            filters.years = filterValues;
            linkKey = 'year';
            break;
          case 3:
            filters.languages = filterValues;
            linkKey = 'lang';
            break;
          case 4:
            filters.letters = filterValues;
            linkKey = 'letter';
            break;
          case 5:
            filters.conditions = filterValues;
            linkKey = 'ifvip';
            break;
          case 6:
            filters.orders = filterValues;
            linkKey = 'by';
            break;
        }

        $(elem).find('a').each((_, linkElem) => {
          const value = (linkElem.attribs['href'] || '')
            .extractBetween(`/${linkKey}/`, '/')
            .replace('.html', '');
          if (!value) return;
          filterValues.push({
            name: linkElem.children[0].data,
            value: decodeURIComponent(value)
          });
        });
      });

      return filters;
    });
};

class Olevod {
  static get INSTANCE() {
    return olevodInstance;
  }

  static get CONSTANTS() {
    return c;
  }

  /**
   * Check if olevod.com is accessible
   * @returns {Promise<boolean>}
   */
  static alive() {
    const {instance = olevodInstance} = jh.convertToByReference(arguments, ['instance']);
    const options = {
      method: 'HEAD',
      url: c.BASE_URL,
    };
    return getResponse(instance, options)
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  /**
   * Get the filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getFilters() {
    const {isAdult, instance = olevodInstance} = jh.convertToByReference(arguments, ['isAdult', 'instance']);
    const options = {
      method: 'GET',
      url: c.BASE_URL
    };
    return getResponse(instance, options)
      .then(response => {
        const $ = cheerio.load(response.data);
        const types = [];
        $('.top_nav').find('a').each((i, elem) => {
          const typeId = parseTypeId(elem.attribs.href);
          if (!typeId || (!isAdult && typeId === c.TYPES.ADULT.value)) return;
          types.push({
            name: elem.children[0].data,
            value: typeId
          });
        });
        const filters = {
          types,
          areas: [],
          years: [],
          languages: [],
          letters: [],
          conditions: [],
          orders: []
        };
        return Promise.all(types.map(type => {
          return getTypeFilters(instance, type.value)
            .then((typeFilters) => {
              type.subTypes = typeFilters.types;
              _.forEach(filters, (value, key) => {
                if (key === 'types') return;
                value.push(...typeFilters[key]);
              });
            });
        }))
          .then(() => {
            _.forEach(filters, (value, key) => {
              filters[key] = _.uniqBy(value, 'value');
            });
            return jh.compactObject(filters);
          });
      });
  }

  /**
   * Search for videos on olevod.com
   * @returns {Promise<Array>}
   */
  static getVideos() {
    const {search, typeId, page = 1, order = c.ORDERS.TIME.value, year, letter, area, language, condition, instance = olevodInstance}
    = jh.convertToByReference(
      arguments,
      ['search', 'typeId', 'page', 'order', 'year', 'letter', 'area', 'language', 'condition', 'instance']
    );

    const vod = typeId ? `show/id/${typeId}` : 'search';

    const options = {
      method: 'GET',
      url: `${c.BASE_URL}/index.php/vod/${vod}.html`,
      params: {
        wd: search,
        page,
        by: order,
        year,
        letter,
        area,
        lang: language,
        ifvip: condition
      }
    };

    return getResponse(instance, options)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const results = [];

        $('.vodlist').find('.searchlist_item, .vodlist_item').each((i, elem) => {
          const result = parseVideoResult($(elem));
          if (!result.detailId) return;
          results.push(result);
        });

        return results;
      });
  };

  /**
   * Get the video info base on id
   * @returns {Promise<Object>}
   */
  static getVideo() {
    let {detailId, instance = olevodInstance} = jh.convertToByReference(arguments, ['detailId', 'instance']);

    const options = {
      method: 'GET',
      url: `${c.BASE_URL}/index.php/vod/detail/id/${detailId}.html`,
    };

    return getResponse(instance, options)
      .then(response => {
        const result = parseDetail(response.data);
        result.detailId = result.detail || detailId;
        return result;
      });
  }

  static getPlayInfo() {
    let {playId, instance = olevodInstance} = jh.convertToByReference(arguments, ['playId', 'instance']);

    const [detailId, sid, nid] = playId.split('-');
    const options = {
      method: 'GET',
      url: `${c.BASE_URL}/index.php/vod/play/id/${detailId}/sid/${sid}/nid/${nid}.html`,
    };

    return getResponse(instance, options)
      .then(response => {
        if (response.data.includes('亲爱的：您没有权限访问此数据，请升级会员'))
            return Promise.reject(jc.ERRORS.LOGIN_REQUIRED);

        const detail = parseDetail(response.data);
        detail.detailId = detail.detail || detailId;

        const $ = cheerio.load(response.data);

        const playerData = JSON.parse(response.data.extractBetween('var player_', '}').replace(/[^=]*=/g, '') + '}');

        const result = {
          playId: playId,
          title: $('.playlist_full').find('.active').text().trim(),
          detail: detail,
          videoUrl: playerData.url
        };

        return jh.compactObject(result);
      });
  }
}

module.exports = Olevod;
