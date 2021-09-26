require('cheerio');
const assert = require('assert');
const Olevod = require('./index');
const OlevodC = require('./constants');
const jh = require('@johman/helper');

before('Confirm Olevod is alive', function () {
  this.timeout(90000);
  return Olevod.alive()
    .then(alive => {
      if (!alive) throw Error('Website not available');
    });
});

describe('olevod', function() {
  describe('getFilters()', function() {
    this.timeout(90000);
    it('get filters without adult types', function() {
      return Olevod.getFilters()
        .then(filters => {
          assert.strictEqual(filters.types.length, Object.keys(OlevodC.TYPES).length - 1);
          assert.strictEqual(filters.orders.length, Object.keys(OlevodC.ORDERS).length);
          assert.strictEqual(filters.areas.length, Object.keys(OlevodC.AREAS).length);
          assert.strictEqual(filters.years.length, Object.keys(OlevodC.YEARS).length);
          assert.strictEqual(filters.languages.length, Object.keys(OlevodC.LANGUAGES).length);
          assert.strictEqual(filters.letters.length, Object.keys(OlevodC.LETTERS).length);
          assert.strictEqual(filters.conditions.length, Object.keys(OlevodC.CONDITIONS).length);
        })
        .catch(jh.handleTestError);
    });
    it('get filters with adult types', function() {
      return Olevod.getFilters({isAdult: true})
        .then(filters => {
          assert.strictEqual(filters.types.length, Object.keys(OlevodC.TYPES).length);
          assert.strictEqual(filters.orders.length, Object.keys(OlevodC.ORDERS).length);
          assert.strictEqual(filters.areas.length, Object.keys(OlevodC.AREAS).length);
          assert.strictEqual(filters.years.length, Object.keys(OlevodC.YEARS).length);
          assert.strictEqual(filters.languages.length, Object.keys(OlevodC.LANGUAGES).length);
          assert.strictEqual(filters.letters.length, Object.keys(OlevodC.LETTERS).length);
          assert.strictEqual(filters.conditions.length, Object.keys(OlevodC.CONDITIONS).length);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getVideos()', function() {
    this.timeout(90000);
    it('search videos without filter`', function(){
      return Olevod.getVideos()
        .then(videos => {
          assert(videos.length > 0);
        })
        .catch(jh.handleTestError);
    });
    it('search videos order by hits`', function(){
      const order = OlevodC.ORDERS.HITS;
      return Olevod.getVideos({order})
        .then(videos => {
          assert(videos.length > 0);
        })
        .catch(jh.handleTestError);
    });
    it('search videos order by rates`', function(){
      const order = OlevodC.ORDERS.RATES;
      return Olevod.getVideos({order})
        .then(videos => {
          assert(videos.length > 0);
        })
        .catch(jh.handleTestError);
    });
    it('search videos with context `星`', function(){
      return Olevod.getVideos({search: '星'})
        .then(videos => {
          assert.strictEqual(videos.length, 27);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getVideo()', function() {
    this.timeout(90000);
    it('get video', function(){
      const detailId = '7619';
      return Olevod.getVideo({detailId})
        .then(video => {
          assert.strictEqual(video.detailId, detailId);
          assert.strictEqual(video.title, '星际穿越');
          assert.strictEqual(video.playInfos.length, 1);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getPlayInfo()', function() {
    this.timeout(90000);
    it('get play info', function(){
      const detailId = '29735';
      const playId = `${detailId}-1-1`;
      return Olevod.getPlayInfo({playId})
        .then(playInfo => {
          assert.strictEqual(playInfo.playId, playId);
          assert.strictEqual(playInfo.title, '高清播放');
          assert.strictEqual(playInfo.detail.detailId, detailId);
          assert.strictEqual(playInfo.detail.title, '失控玩家');
        })
        .catch(jh.handleTestError);
    });
  });
});
