en = require('./locales/en.json');
ja = require('./locales/ja.json');
ko = require('./locales/ko.json');
zhCN = require('./locales/zh-CN.json');
zhTW = require('./locales/zh-TW.json');


function langChecker(req, res, next) {
  // console.log(en)
  if (req.session.locale == 'zh-TW'){
    lang = zhTW;
    
  }else if(req.session.locale == 'ja'){
    lang = en;

  }else if(req.session.locale == 'ko'){
    lang = en;
    
  }else if(req.session.locale == 'zh-CN'){
    lang = zhCN;
    
  }else{
    lang = en;
  }

  next();  
}

module.exports = langChecker;
