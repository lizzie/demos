#!/usr/bin/env node

var request = require('sync-request'),
  fs = require('fs'),
  path = require('path'),
  commander = require('commander'),
  colors = require('colors'),
  iconv = require('iconv-lite'),
  properties = require('properties');

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
  ignore_list_path = path.join(__dirname, 'ignore_list.json'),
  properties_path = path.join(__dirname, 'data.properties'),

  TITLE_REG = /<h3 class="ui-tipbox-title">(.*?)<\/h3>/,
  DESCRIPTION_REG = /<p class="ui-tipbox-explain">((?:.|\s)*?)<\/p>/m,

  ignore_list = require(ignore_list_path),
  new_ignore_list = [];

function _write(file_path, json_obj) {
  var fileStore = fs.createWriteStream(file_path);

  fileStore.on('open', function() {
    fileStore.write(JSON.stringify(json_obj, null, 2));
    fileStore.end();
  });
}

function _write_ignore_list() {
  var has_new = false;
  ignore_list.push('===============');
  new_ignore_list.forEach(function(value) {
    if (!_in_ignore_list(value, true)) {
      ignore_list.push(value);
      has_new = true;
    }
  });
  if (!has_new) {
    ignore_list = ignore_list.slice(0, ignore_list.length - 1);
  }
  _write(ignore_list_path, ignore_list);
}

function _in_ignore_list(target, hard) {
  var result = ignore_list.filter(function(val, index, arr) {
    return hard ? target === val : target.indexOf(val) !== -1;
  });
  return !!result.length;
}

function _original() {
  if (!fs.existsSync(original_data_path)) return;

  var original_error_list = require(original_data_path)['data'][0],
    error_list = {};

  Object.keys(original_error_list).forEach(function(key) {
    Object.keys(original_error_list[key]).forEach(function(ke) {
      original_error_list[key][ke].forEach(function(value) {
        if (!_in_ignore_list(value['key'][0])) {
          error_list[value['key'][0]] = 1;
        } else {
          console.log(colors.prompt('ignore: '), colors.debug(value['key'][0]));
          new_ignore_list.push(value['key'][0]);
        }
      });
    });
  });

  _write(error_list_path, Object.keys(error_list));
  _write_ignore_list();

  console.log(colors.info('see error_list.json\n'));
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

  var error_list = require(error_list_path),
    result_list = [];

  error_list.forEach(function(error_str) {
    var error_title,
      error_description,
      res = request('GET', ['http://cashier.stable.alipay.net/home/error.htm?errorCode=', error_str.split('@')[0],
        '&subErrorCode=', error_str.split('@')[1] || '', '&orderId=040800bab446ffd636305cer.t148861'].join('')),
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
    console.log(colors.info(error_str));
    if (error_description.indexOf('null') === -1 && !target_error_obj[error_str]) {
      result_list.push(['', 'CASHIER', error_str, '', 'PAY_ORDER', '', '', '', '', 'text',
        colors.debug(error_title), 'html', colors.verbose(error_description || ' '), '', '', '', ''].join(','));
    } else if (error_description.indexOf('null') >= 0) {
      new_ignore_list.push(error_str);
    }

    target_error_obj[error_str] = [error_title, error_description];
  });

  _write(target_path, target_error_obj);
  _write_ignore_list();

  console.log(colors.info("==================================="));
  console.log(result_list.join('\n'));
}

function _properties() {
  properties.parse(properties_path, {path: true}, function(error, obj) {
    if (error) return console.error(error);

    Object.keys(obj).forEach(function(key, val) {
      console.log(['', 'CASHIER', 'ICC_APPLY_FAIL@' + key, '', 'PAY_ORDER', '', '', '', '', 'text',
        colors.debug(obj[key].trim()), 'html', ' ', '', '', '', ''].join(','))
    });
  });
}

commander.version('0.0.1')
  .usage('[options]')
  .option('-o, --original', 'process original data')
  .option('-f, --fetch', 'fetch title & description')
  .option('-p, --properties', 'generate from properties file')
  .option('-g, --generate', 'generate csv file')
  .parse(process.argv);

if (commander.original) {
  _original();
}

if (commander.fetch) {
  _fetch();
}

if (commander.properties) {
  _properties();
}