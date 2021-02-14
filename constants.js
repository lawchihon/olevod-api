module.exports.BASE_URL = Object.freeze('https://www.olevod.com');

module.exports.ORDERS = {
  TIME: {
    name: '按最新',
    value: 'time'
  },
  TIME_ADD: {
    name: '按添加',
    value: 'time_add'
  },
  HITS: {
    name: '按最热',
    value: 'hits'
  },
  RATES: {
    name: '按评分',
    value: 'score'
  }
};

module.exports.TYPES = {
  MOVIE: {
    name: '电影',
    value: '1',
    subTypes: [{
      name: '动作片',
      value: '101'
    }, {
      name: '喜剧片',
      value: '102'
    }, {
      name: '爱情片',
      value: '103'
    }, {
      name: '科幻片',
      value: '104'
    }, {
      name: '恐怖片',
      value: '105'
    }, {
      name: '剧情片',
      value: '106'
    }, {
      name: '战争片',
      value: '107'
    }, {
      name: '动画片',
      value: '108'
    }, {
      name: '悬疑片',
      value: '109'
    }, {
      name: '惊悚片',
      value: '110'
    }, {
      name: '纪录片',
      value: '111'
    }, {
      name: '奇幻片',
      value: '112'
    }, {
      name: '犯罪片',
      value: '113'
    }]
  },
  DRAMA: {
    name: '连续剧',
    value: '2',
    subTypes: [{
      name: '国产剧',
      value: '202'
    }, {
      name: '欧美剧',
      value: '201'
    }, {
      name: '港台剧',
      value: '203'
    }, {
      name: '日韩剧',
      value: '204'
    }]
  },
  SHOW: {
    name: '综艺',
    value: '3',
    subTypes: [{
      name: '真人秀',
      value: '305'
    }, {
      name: '音乐',
      value: '302'
    }, {
      name: '搞笑',
      value: '304'
    }, {
      name: '家庭',
      value: '301'
    }, {
      name: '曲艺',
      value: '303'
    }]
  },
  ANIME: {
    name: '动漫',
    value: '4',
    subTypes: [{
      name: '日本',
      value: '401'
    }, {
      name: '国产',
      value: '402'
    }, {
      name: '欧美',
      value: '403'
    }]
  },
  ADULT: {
    name: '午夜影院',
    value: '5',
    subTypes: [{
      name: 'AV女优',
      value: '505'
    }, {
      name: '日韩',
      value: '502'
    }, {
      name: '欧美',
      value: '501'
    }, {
      name: '动漫',
      value: '503'
    }, {
      name: '国产',
      value: '504'
    }]
  },
  VIP: {
    name: 'VIP蓝光影院',
    value: '6',
    subTypes: [{
      name: '动作片',
      value: '601'
    }, {
      name: '喜剧片',
      value: '602'
    }, {
      name: '爱情片',
      value: '603'
    }, {
      name: '科幻片',
      value: '604'
    }, {
      name: '恐怖片',
      value: '605'
    }, {
      name: '剧情片',
      value: '606'
    }, {
      name: '战争片',
      value: '607'
    }, {
      name: '动画片',
      value: '608'
    }, {
      name: '悬疑片',
      value: '609'
    }, {
      name: '惊悚片',
      value: '610'
    }, {
      name: '纪录片',
      value: '611'
    }, {
      name: '奇幻片',
      value: '612'
    }, {
      name: '犯罪片',
      value: '613'
    }]
  },
};

module.exports.AREAS = {
  CHINA: {
    name: '大陆',
    value: '大陆'
  },
  HONG_KONG: {
    name: '香港',
    value: '香港'
  },
  TAIWAN: {
    name: '台湾',
    value: '台湾'
  },
  UNITED_STATES: {
    name: '美国',
    value: '美国'
  },
  KOREA: {
    name: '韩国',
    value: '韩国'
  },
  JAPAN: {
    name: '日本',
    value: '日本'
  },
  INDIA: {
    name: '印度',
    value: '印度'
  },
  ENGLAND: {
    name: '英国',
    value: '英国'
  },
  FRANCE: {
    name: '法国',
    value: '法国'
  },
  CANADA: {
    name: '加拿大',
    value: '加拿大'
  },
  SPAIN: {
    name: '西班牙',
    value: '西班牙'
  },
  RUSSIA: {
    name: '俄罗斯',
    value: '俄罗斯'
  },
  ITALY: {
    name: '意大利',
    value: '意大利'
  },
  THAILAND: {
    name: '泰国',
    value: '泰国'
  },
  SINGAPORE: {
    name: '新加坡',
    value: '新加坡'
  },
  MALAYSIA: {
    name: '马来西亚',
    value: '马来西亚'
  },
  OTHERS: {
    name: '其它',
    value: '其它'
  }
};

module.exports.YEARS = {
  2021: {
    name: '2021',
    value: '2021'
  },
  2020: {
    name: '2020',
    value: '2020'
  },
  2019: {
    name: '2019',
    value: '2019'
  },
  2018: {
    name: '2018',
    value: '2018'
  },
  2017: {
    name: '2017',
    value: '2017'
  },
  2016: {
    name: '2016',
    value: '2016'
  },
  2015: {
    name: '2015',
    value: '2015'
  },
  2014: {
    name: '2014',
    value: '2014'
  },
  2013: {
    name: '2013',
    value: '2013'
  },
  2012: {
    name: '2012',
    value: '2012'
  },
  2011: {
    name: '2011',
    value: '2011'
  },
  2010: {
    name: '2010',
    value: '2010'
  },
  2009: {
    name: '2009',
    value: '2009'
  },
  2008: {
    name: '2008',
    value: '2008'
  },
  2007: {
    name: '2007',
    value: '2007'
  },
  2006: {
    name: '2006',
    value: '2006'
  },
  2005: {
    name: '2005',
    value: '2005'
  },
  2004: {
    name: '2004',
    value: '2004'
  },
  2003: {
    name: '2003',
    value: '2003'
  },
  2002: {
    name: '2002',
    value: '2002'
  },
  2001: {
    name: '2001',
    value: '2001'
  },
  2000: {
    name: '2000',
    value: '2000'
  }
};

module.exports.LANGUAGES = {
  CHINESE: {
    name: '国语',
    value: '国语'
  },
  ENGLISH: {
    name: '英语',
    value: '英语'
  },
  CANTONESE: {
    name: '粤语',
    value: '粤语'
  },
  SPANISH: {
    name: '西语',
    value: '西语'
  },
  KOREAN: {
    name: '韩语',
    value: '韩语'
  },
  JAPANESE: {
    name: '日语',
    value: '日语'
  },
  FRENCH: {
    name: '法语',
    value: '法语'
  },
  RUSSIAN: {
    name: '俄语',
    value: '俄语'
  },
  ITALIAN: {
    name: '意大利语',
    value: '意大利语'
  },
  GERMAN: {
    name: '德语',
    value: '德语'
  },
  HINDI: {
    name: '印地语',
    value: '印地语'
  },
  OTHER: {
    name: '其它',
    value: '其它'
  }
};

module.exports.LETTERS = {
  A: {
    name: 'A',
    value: 'A'
  },
  B: {
    name: 'B',
    value: 'B'
  },
  C: {
    name: 'C',
    value: 'C'
  },
  D: {
    name: 'D',
    value: 'D'
  },
  E: {
    name: 'E',
    value: 'E'
  },
  F: {
    name: 'F',
    value: 'F'
  },
  G: {
    name: 'G',
    value: 'G'
  },
  H: {
    name: 'H',
    value: 'H'
  },
  I: {
    name: 'I',
    value: 'I'
  },
  J: {
    name: 'J',
    value: 'J'
  },
  K: {
    name: 'K',
    value: 'K'
  },
  L: {
    name: 'L',
    value: 'L'
  },
  M: {
    name: 'M',
    value: 'M'
  },
  N: {
    name: 'N',
    value: 'N'
  },
  O: {
    name: 'O',
    value: 'O'
  },
  P: {
    name: 'P',
    value: 'P'
  },
  Q: {
    name: 'Q',
    value: 'Q'
  },
  R: {
    name: 'R',
    value: 'R'
  },
  S: {
    name: 'S',
    value: 'S'
  },
  T: {
    name: 'T',
    value: 'T'
  },
  U: {
    name: 'U',
    value: 'U'
  },
  V: {
    name: 'V',
    value: 'V'
  },
  W: {
    name: 'W',
    value: 'W'
  },
  X: {
    name: 'X',
    value: 'X'
  },
  Y: {
    name: 'Y',
    value: 'Y'
  },
  Z: {
    name: 'Z',
    value: 'Z'
  },
  NUMBER: {
    name: '0-9',
    value: '0-9'
  }
};

module.exports.CONDITIONS = {
  FREE: {
    name: '免费',
    value: '2'
  },
  VIP: {
    name: '会员',
    value: '3'
  }
};
