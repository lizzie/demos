#!/usr/bin/env node

var request = require('sync-request'),
  fs = require('fs'),
  path = require('path'),
  commander = require('commander'),
  colors = require('colors'),
  iconv = require('iconv-lite');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'white',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

// 最原始的数据
var original_data_path = path.join(__dirname, 'data.json'),
  error_list_path = path.join(__dirname, 'error_list.json'),
  target_path = path.join(__dirname, 'target.json'),
  TITLE_REG = /<h3 class="ui-tipbox-title">(.*?)<\/h3>/,
  DESCRIPTION_REG = /<p class="ui-tipbox-explain">((?:.|\s)*?)<\/p>/m,
  IGNORE_LIST = [
    'SECURITY_CHECK_FAIL',
    'ICC_APPLY_FAIL',
    'DEPOSIT',
    'ICC_PAY_PENDING',
    'DISCOUNT_APPLY_FAILED',
    'CARTOON_NEED_MOBILE',
    'CHANNEL_ROUTE_FAILED',
    '[H]',
    '[E]'
  ];

function _original() {
  if (fs.existsSync(original_data_path)) {
    var original_error_list = require(original_data_path)['data'][0],
      error_list = {};

    Object.keys(original_error_list).forEach(function(key) {
      Object.keys(original_error_list[key]).forEach(function(ke) {
        original_error_list[key][ke].forEach(function(value) {

          var need_ignore = IGNORE_LIST.filter(function(val, index, arr) {
            return value['key'][0].indexOf(val) !== -1;
          });

          if (!need_ignore.length) {
            error_list[value['key'][0]] = 1;
          } else {
            console.log(colors.prompt('igore: '), colors.debug(value['key'][0]))
          }
        });
      });
    });

    error_list = Object.keys(error_list);

    var fileStore = fs.createWriteStream(error_list_path);

    fileStore.on('open', function() {
      fileStore.write(JSON.stringify(error_list));
      fileStore.end();
    });

    console.log(colors.info('see error_list.json\n'));
  }
}

function _fetch() {
  var target_error_obj = {};

  if (fs.existsSync(target_path)) {
    target_error_obj = require(target_path);
  } else {
    var ws = fs.createWriteStream(target_path);

    ws.on('open', function() {
      ws.write(JSON.stringify({}));
      ws.end();
    });
  }

  var error_list = require(error_list_path);

  error_list.forEach(function(error_str) {
    error_str = error_str.split('@');
    var error_code = error_str[0],
      sub_error_code = error_str[1],
      error_title,
      error_description,
      res = request('GET', ['http://cashier.stable.alipay.net/home/error.htm?errorCode=', error_code,
        '&subErrorCode=', sub_error_code, '&orderId=040800bab446ffd636305cer.t148861'].join('')),
      html_str = iconv.decode(res.getBody(), 'GBK');

    error_title = html_str.match(TITLE_REG) || '抱歉，无法完成付款';
    if (error_title) {
      error_title = error_title[1].trim();
    }

    error_description = html_str.match(DESCRIPTION_REG) || '';
    if (error_description) {
      error_description = error_description[1].trim();
    }

    // 描述中不包含 null && 去重
    if (error_description.indexOf('null') === -1 && !target_error_obj[error_str.join('@')]) {
      console.log(['', 'CASHIER', error_str.join('@'), '', 'PAY_ORDER', '', '', '', '', 'text',
        colors.debug(error_title), 'html', colors.verbose(error_description), '', '', '', ''].join(','));
    }

    target_error_obj[error_str.join('@')] = [error_title, error_description];
    var fileStore = fs.createWriteStream(target_path);

    fileStore.on('open', function() {
      fileStore.write(JSON.stringify(target_error_obj));
      fileStore.end();
    });
  });
}

commander.version('0.0.1')
  .usage('[options]')
  .option('-o, --original', 'process original data')
  .option('-f, --fetch', 'fetch title & description')
  .option('-g, --generate', 'generate csv file')
  .parse(process.argv);

if (commander.original) {
  _original();
}

if (commander.fetch) {
  _fetch();
}
