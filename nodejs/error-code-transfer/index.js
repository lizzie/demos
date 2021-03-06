#!/Users/shengyan/.nvm/versions/io.js/v2.0.2/bin/node

var Promise = require('promise'),
  request = require('request'),
  fs = require('fs'),
  path = require('path'),
  commander = require('commander'),
  colors = require('colors'),
  iconv = require('iconv-lite'),
  Q = require('q'),
  csv = require('csv'),
  properties = require('properties'),
  config = require('./config.json');

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
  ae_list_path = path.join(__dirname, 'ae_list.json'),
  target_path = path.join(__dirname, 'target.json'),
  ignore_list_path = path.join(__dirname, 'ignore_list.json'),
  properties_path = path.join(__dirname, 'data.properties'),
  all_csv_path = path.join(__dirname, 'all.csv'),

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
    if(!_in_ignore_list(value, true)) {
      ignore_list.push(value);
      has_new = true;
    }
  });
  if(!has_new) {
    ignore_list = ignore_list.slice(0, ignore_list.length - 1);
  }
  _write(ignore_list_path, ignore_list);
}

function _in_ignore_list(target, hard) {
  var result = ignore_list.filter(function(val) {
    return hard ? target === val : target.indexOf(val) !== -1;
  });
  return !!result.length;
}

function _crawl() {
  var body = config['crawl-body'],
    now = new Date(),
    last_minutes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), Math.max(now.getMinutes() - 5, 0), 0);
  body[0]['condition']['start'] = last_minutes.getTime();
  body[0]['condition']['end'] = last_minutes.getTime();
  console.log(body[0]['condition']['start'], body[0]['condition']['end']);
  try {
    request({
      url: config['crawl-url'],
      method: 'POST',
      json: true,
      headers: config['crawl-headers'],
      body: body
    }).pipe(fs.createWriteStream(original_data_path));

  } catch (e) {
    console.log('crawl error ', e)
  }
}

function _original() {
  if(!fs.existsSync(original_data_path)) return;

  var original_error_list = require(original_data_path),
    ae_list = require(ae_list_path),
    error_list = {};

  if(!original_error_list['success']) return;
  original_error_list = original_error_list['data'][0];

  Object.keys(original_error_list).forEach(function(key) {
    Object.keys(original_error_list[key]).forEach(function(ke) {
      original_error_list[key][ke].forEach(function(value) {
        if(!_in_ignore_list(value['key'][0])) {
          error_list[value['key'][0]] = 1;
        } else {
          if(value['key'][0].indexOf('AE') === -1) {
            new_ignore_list.push(value['key'][0]);
          } else if(value['key'][0].indexOf('@') === -1 && ae_list.indexOf(value['key'][0]) === -1) {
            ae_list.push(value['key'][0]);
          }
        }
      });
    });
  });

  _write(ae_list_path, ae_list);
  _write(error_list_path, Object.keys(error_list));
  _write_ignore_list();
}

function _fetch() {
  var target_error_obj = {};

  if(fs.existsSync(target_path)) {
    target_error_obj = require(target_path);
  } else {
    var ws = fs.createWriteStream(target_path);

    ws.on('open', function() {
      ws.write(JSON.stringify({}));
      ws.end();
    });
  }

  Q.all(require(error_list_path).map(function(error_str) {
    return new Promise(function(resolve, reject) {
      request.get([config['url-prefix'], error_str.split('@')[0],
        '&subErrorCode=', error_str.split('@')[1] || '', config['order-id']].join(''))
        .pipe(iconv.decodeStream('GBK')).collect(function(err, html_str) {
          if(err) {
            reject(err);
          } else {
            var error_title,
              error_description,
              output = '';

            error_title = html_str.match(TITLE_REG) || ['', '抱歉，无法完成付款'];
            if(error_title) {
              error_title = error_title[1].trim();
            }

            error_description = html_str.match(DESCRIPTION_REG) || ['', ''];
            if(error_description) {
              error_description = error_description[1].trim();
            }

            console.log(error_str);
            // 描述中不包含 null && 去重
            if(/*error_description.indexOf('null') === -1 && */!target_error_obj[error_str]) {
              output = ['', 'CASHIER', error_str, '', 'PAY_ORDER', '', '', '', '', 'text',
                colors.debug(error_title), 'html', colors.verbose(error_description || ' '), '', '', '', ''].join(',');
            }/* else if(error_description.indexOf('null') >= 0) {
              new_ignore_list.push(error_str);
            }*/

            target_error_obj[error_str] = [error_title, error_description];
            resolve(output);
          }
        });
    });
  })).done(function(results) {
    _write(target_path, target_error_obj);
    _write_ignore_list();

    console.log(colors.info('==================================='));
    console.log(results.join('\n'));
  });
}

function _properties() {
  properties.parse(properties_path, {path: true}, function(error, obj) {
    if(error) return;

    Object.keys(obj).forEach(function(key) {
      console.log(['', 'CASHIER', 'ICC_APPLY_FAIL@' + key, '', 'PAY_ORDER', '', '', '', '', 'text',
        colors.debug(obj[key].trim()), 'html', ' ', '', '', '', ''].join(','))
    });
  });
}

function _find_csv_items(search_data, all_data) {
  search_data.forEach(function(search_item) {
    var match_item = null;

    all_data.forEach(function(all_items) {
      if(search_item[0] === all_items[2]) {
        match_item = all_items;
        return false;
      }
    });

    if(match_item) {
      console.log([colors.verbose('SYSTEM_EXCEPTION' + '@' + search_item[0]), colors.grey(search_item[1]), colors.debug(match_item[4])].join(','));
    } else {
      console.log([colors.verbose('SYSTEM_EXCEPTION' + '@' + search_item[0]), colors.grey(search_item[1]), ''].join(','));
    }
  });
}

function _find_csv() {
  fs.createReadStream(path.join(__dirname, 'search.csv')).pipe(csv.parse(function(err, search_data) {
    fs.createReadStream(path.join(__dirname, 'all.csv')).pipe(csv.parse(function(err, all_data) {
      _find_csv_items(search_data, all_data);
    }));
  }));
}

commander.version('0.0.1')
  .usage('[options]')
  .option('-c, --crawl', 'crawl')
  .option('-o, --original', 'process original data')
  .option('-f, --fetch', 'fetch title & description')
  .option('-p, --properties', 'generate from properties file')
  .option('-s, --csv', 'csv')
  .parse(process.argv);

if(commander.crawl) {
  _crawl();
}

if(commander.original) {
  _original();
}

if(commander.fetch) {
  _fetch();
}

if(commander.properties) {
  _properties();
}

if(commander.csv) {
  _find_csv();
}

