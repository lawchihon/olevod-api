const _ = require('lodash');
const cheerio = require('cheerio');
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

const parseDetailId = (link) => {
  return link.replace(/\/\?m=vod-detail-id-|.html/g, '')
};

const parsePlayId = (link) => {
  return link.replace(/\/\?m=vod-play-id-|.html/g, '')
};

const parseVideoResult = (element) => {
  const img = element.find('img');
  const firstLink = element.find('a').first();
  const imgLink = img.attr('data-original') || img.attr('src');
  const result = {
    detailId: parseDetailId(firstLink.attr('href')),
    title: element.find('h6').find('a').text().trim() || firstLink.text().trim(),
    picture: imgLink ? `${c.BASE_URL}${imgLink}` : undefined,
    // mark: element.find('.mark, .figure_mask').text().trim(),
    // scores: element.find('.scores').find('strong').text().trim()
  };

  //TODO: parse for more description

  return jh.compactObject(result);
};

const parseDetail = (html) => {
  const $ = cheerio.load(html);
  const current = $('.current');
  const result = {
    detailId: parseDetailId(current.attr('href')),
    title: current.text().trim(),
    picture: c.BASE_URL + $('.mod_vod_box').find('.lazy').attr('src'),
    description: $('.c9.mt5.ftno').text().replace(/欢迎在线观看《[\S\s]*/g, '').trim()
  };
  return jh.compactObject(result);
};

const parsePlayInfo = (element) => {
  const result = {
    playId: parsePlayId(element.attr('href')),
    title: element.text()
  };
  return jh.compactObject(result);
};

const parseTypes = (html) => {
  const $ = cheerio.load(html);
  const types = [];
  $('.list_item').each((i, elem) => {
    let lastType;
    const links = $(elem).find('a');
    links.last().remove();
    links.each((i, link) => {
      const url = link.attribs.href;
      if (!url || !url.startsWith('/?m=vod-type-id-')) return;
      const type = {
        name: $(link).text(),
        value: url.replace(/\/\?m=vod-type-id-|.html$/g, '')
      };
      if (i === 0) {
        type.subTypes = [];
        types.push(type);
        lastType = type;
        return;
      }
      if (!lastType) return;
      lastType.subTypes.push(type);
    });
  });
  return types;
};

const getDefaultList = (instance) => {
  const options = {
    method: 'GET',
    url: `${c.BASE_URL}/?m=vod-list-id-1.html`
  };
  return instance(options)
};

const getConditionFilter = (index, startString, endString, instance) => {
  const filters = [];
  return getDefaultList(instance)
    .then(response => {
      const $ = cheerio.load(response.data);
      $('.mod_cont').eq(index).find('a').each((i, elem) => {
        if (i === 0) return;
        filters.push({
          name: elem.children[0].data,
          value: decodeURIComponent(elem.attribs.href.extractBetween(startString, endString))
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
    return instance(options)
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  /**
   * Get the type filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getTypes() {
    const {isAdult, instance = olevodInstance} = jh.convertToByReference(arguments, ['isAdult', 'instance']);
    const calls = [getDefaultList(instance)];
    if (isAdult) {
      calls.push(
        instance({
          method: 'GET',
          url: `${c.BASE_URL}/index.php?m=label-a_vod_index.html`
        })
      )
    }

    const types = [];
    return Promise.all(calls)
      .then(responses => {
        responses.forEach((response, index) => {
          const newTypes = parseTypes(response.data);
          if (isAdult && index === 1) {
            newTypes.forEach(newType => {
              newType.name = `午夜影院 ${newType.name}`;
            })
          }
          types.push(...newTypes);
        });

        return types;
      });
  }

  /**
   * Get the order filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getOrders() {
    const {instance = olevodInstance} = jh.convertToByReference(arguments, ['instance']);
    const orders = [];
    return getDefaultList(instance)
      .then(response => {
        const $ = cheerio.load(response.data);

        $('.mod_toolbar').find('a').each((i, elem) => {
          orders.push({
            name: elem.children[0].data,
            value: elem.attribs.href.extractBetween('order-', '-class')
          })
        });

        return orders;
      });
  }

  /**
   * Get the year filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getYears() {
    const {instance = olevodInstance} = jh.convertToByReference(arguments, ['instance']);
    return getConditionFilter(1, 'year-', '-', instance);
  }

  /**
   * Get the area filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getAreas() {
    const {instance = olevodInstance} = jh.convertToByReference(arguments, ['instance']);
    return getConditionFilter(2, 'area-', '-', instance);
  }

  /**
   * Get the language filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getLanguages() {
    const {instance = olevodInstance} = jh.convertToByReference(arguments, ['instance']);
    return getConditionFilter(3, 'lang-', '.html', instance);
  }

  /**
   * Get the letter filters that is supported on olevod.com
   * @returns {Promise<{}>}
   */
  static getLetters() {
    const {instance = olevodInstance} = jh.convertToByReference(arguments, ['instance']);
    return getConditionFilter(4, 'letter-', '-', instance);
  }

  /**
   * Search for videos on olevod.com
   * @returns {Promise<Array>}
   */
  static getVideos() {
    const {search, typeId, page = 1, order = c.ORDERS.TIME, year, letter, area, language, instance = olevodInstance}
    = jh.convertToByReference(
      arguments,
      ['search', 'typeId', 'page', 'order', 'year', 'letter', 'area', 'language', 'instance']
    );

    // When it doesn't have typeId or search
    if (!typeId && !search) {
      let mode;
      switch (order){
        case c.ORDERS.HITS:
        case c.ORDERS.RATES:
          mode = 'vod-map';
          break;
        case c.ORDERS.TIME:
        default:
          mode = 'label-new';
      }

      const options = {
        method: 'GET',
        url: `${c.BASE_URL}/index.php`,
        params: {
          m: `${mode}.html`,
        }
      };
      return instance(options)
        .then((response) => {
          const $ = cheerio.load(response.data);
          const results = [];

          $('.n-content, .w-content').each((i, elem) => {
            const element = $(elem);
            const section = element.find('.title').text().trim();

            let lists;
            switch (order){
              case c.ORDERS.HITS:
                lists = element.find('ul').last().find('li');
                break;
              case c.ORDERS.RATES:
                lists = element.find('ul').first().find('li');
                break;
              case c.ORDERS.TIME:
              default:
                lists = element.find('li');
            }

            lists.each((i, elem) => {
              const result = parseVideoResult($(elem));
              result.section = section;
              results.push(result);
            })
          });

          return results;
        })
    }

    const vod = search ? `search` : `list-id-${typeId}`;

    const options = {
      method: 'GET',
      url: `${c.BASE_URL}/index.php`,
      params: {
        m: `vod-${vod}-pg-${page}-wd-${search || ''}-order-${order || ''}-class--year-${year || ''}-letter-${letter || ''}-area-${area || ''}-lang-${language || ''}.html`,
      }
    };

    return instance(options)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const results = [];

        $('.mod_video_list, .mod_list').find('li').each((i, elem) => {
          results.push(parseVideoResult($(elem)));
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
      url: c.BASE_URL,
      params: {
        m: `vod-detail-id-${detailId}.html`,
      }
    };

    return instance(options)
      .then(response => {
        const result = parseDetail(response.data);

        const $ = cheerio.load(response.data);
        result.playInfos = [];
        $('.showplayul').find('a').each((i, elem) => {
          result.playInfos.push(parsePlayInfo($(elem)));
        });

        return result;
      });
  }

  static getPlayInfo() {
    let {playId, instance = olevodInstance} = jh.convertToByReference(arguments, ['playId', 'instance']);

    const options = {
      method: 'GET',
      url: c.BASE_URL,
      params: {
        m: `vod-play-id-${playId}.html`,
      }
    };

    return instance(options)
      .then(response => {
        const detail = parseDetail(response.data);

        const $ = cheerio.load(response.data);

        const urlName = response.data.extractBetween('this.videoUrl = ', ';');
        const urlCommand = response.data.extractBetween(`${urlName} = `, ';');
        const context = {};
        vm.createContext(context);
        vm.runInContext(`${urlName} = ${urlCommand}`, context);

        const result = {
          playId: playId,
          title: $('.play_nav').find('dd').text().trim(),
          detail: detail,
          videoUrl: context[urlName]
        };

        return jh.compactObject(result);
      });
  }
}

module.exports = Olevod;
