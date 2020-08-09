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
  describe('getTypes()', function() {
    this.timeout(90000);
    it('get type filters without adult types', function() {
      return Olevod.getTypes()
        .then(filters => {
          assert(filters.length, 5);
        })
        .catch(jh.handleTestError);
    });
    it('get type filters with adult types', function() {
      return Olevod.getTypes({isAdult: true})
        .then(filters => {
          assert(filters.length, 9);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getOrders()', function() {
    this.timeout(90000);
    it('get order filters', function() {
      return Olevod.getOrders()
        .then(orders => {
          assert(orders.length, 3);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getYears()', function() {
    this.timeout(90000);
    it('get year filters', function() {
      return Olevod.getYears()
        .then(filters => {
          assert(filters.length >= 7);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getAreas()', function() {
    this.timeout(90000);
    it('get area filters', function() {
      return Olevod.getAreas()
        .then(filters => {
          assert(filters.length >= 16);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getLanguages()', function() {
    this.timeout(90000);
    it('get language filters', function() {
      return Olevod.getLanguages()
        .then(filters => {
          assert(filters.length >= 9);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getLetters()', function() {
    this.timeout(90000);
    it('get letter filters', function() {
      return Olevod.getLetters()
        .then(filters => {
          assert(filters.length, 26);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getVideos()', function() {
    this.timeout(90000);
    it('search videos without filter`', function(){
      return Olevod.getVideos()
        .then(videos => {
          assert(videos.length, 40);
        })
        .catch(jh.handleTestError);
    });
    it('search videos order by hits`', function(){
      const order = OlevodC.ORDERS.HITS;
      return Olevod.getVideos({order})
        .then(videos => {
          assert(videos.length, 80);
        })
        .catch(jh.handleTestError);
    });
    it('search videos order by rates`', function(){
      const order = OlevodC.ORDERS.RATES;
      return Olevod.getVideos({order})
        .then(videos => {
          assert(videos.length, 80);
        })
        .catch(jh.handleTestError);
    });
    it('search videos with context `星`', function(){
      return Olevod.getVideos({search: '星'})
        .then(videos => {
          assert(videos.length > 0);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getVideo()', function() {
    this.timeout(90000);
    it('get video', function(){
      const detailId = '1';
      return Olevod.getVideo({detailId})
        .then(video => {
          assert(video.detailId, detailId);
          assert(video.title, '星际穿越');
          assert(video.playInfos.length, 1);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getPlayInfo()', function() {
    this.timeout(90000);
    it('get play info', function(){
      const playId = '1-src-1-num-1';
      return Olevod.getPlayInfo({playId})
        .then(playInfo => {
          assert(playInfo.playId, playId);
          assert(playInfo.title, '《星际穿越》-��线播放');
          assert(playInfo.detail.detailId, '1');
          assert(playInfo.detail.title, '星际穿越');
        })
        .catch(jh.handleTestError);
    });
  });
});
