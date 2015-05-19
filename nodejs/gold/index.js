#!/usr/bin/env node

var request = require('request'),
  fs = require('fs'),
  path = require('path'),
  commander = require('commander'),
  notifier = require('node-notifier'),
  colors = require('colors'),
  spawn = require('child_process').spawn;

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

var data_path = './data.json',
  original_price_date_list = {},
  DATA_REG = /var Data=(\[.*]);/g;

function _notify(price) {
  notifier.notify({
    title: 'Aha, the gold price',
    message: price,
    icon: path.join(__dirname, 'gold.png'),
    sound: true,
    wait: true
  });
}

function _fetch(callback) {
  if (fs.existsSync(data_path)) {
    original_price_date_list = require(data_path);
  } else {
    var ws = fs.createWriteStream(data_path);

    ws.on('open', function() {
      ws.write(JSON.stringify({}));
      ws.end();
    });
  }

  /**
   * Original Data
   * var Data=[{"fundGoldPrice":238.33,"marketGoldPrice":237.73,"netValueDate":"2015-05-05"} , ...];
   * To
   * {"2015-05-05": 238.33, ...}
   */
  request({
    uri: 'https://goldetfprod.alipay.com/gold/queryChart.htm?productCode=000930&t=' + (new Date()).getTime()
  }, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log(colors.error('download error.'));
    } else {
      var matchData = DATA_REG.exec(body);
      if (matchData) {
        var price_date_list = JSON.parse(matchData[1]),
          latest;

        price_date_list.forEach(function(data) {
          if (!latest) {
            latest = data.netValueDate;
          }
          original_price_date_list[data.netValueDate] = data.fundGoldPrice;
        });
        if (latest) {
          _notify([latest, original_price_date_list[latest]].join(' '));
        }

        var fileStore = fs.createWriteStream(data_path);

        fileStore.on('open', function() {
          fileStore.write(JSON.stringify(original_price_date_list));
          fileStore.end();
        });

        console.log(colors.info('data saved.'));
        callback && callback();
      } else {
        console.log(colors.warn('no data find.'));
      }
    }
  });
}

function _show() {
  var ws = fs.createReadStream(data_path);

  ws.on('data', function(chunk) {
    console.log(colors.data('========================'));
    var data = JSON.parse(chunk);

    Object.keys(data).sort().forEach(function(key) {
      console.log([colors.verbose(key), colors.data(data[key])].join('\t'))
    });

  }).on('close', function() {
    ws.close();

    console.log(colors.data('========================'));
  });
}

commander.version('0.0.1')
  .usage('[options]')
  .option('-f, --fetch', 'fetch data')
  .option('-s, --show', 'show trend of gold price')
  .option('-t, --test', 'just for testing')
  .option('-c, --commit', 'git commit && git push')
  .parse(process.argv);

if (commander.fetch) {
  _fetch(function() {
    _show();
    if(commander.commit) {
      var ci = spawn('git', ['commit', '-am', 'other: update gold price data']);
      ci.on('close', function (code) {
        spawn('git', ['push']);
      });
    }
  });
}

if (commander.show) {
  _show();
}

if (commander.test) {
  console.log();
  console.log(colors.error("this is an error"));
  console.log(colors.silly("this is an silly"));
  console.log(colors.input("this is an input"));
  console.log(colors.verbose("this is an verbose"));
  console.log(colors.prompt("this is an prompt"));
  console.log(colors.info("this is an info"));
  console.log(colors.data("this is an data"));
  console.log(colors.help("this is an help"));
  console.log(colors.warn("this is an warn"));
  console.log(colors.debug("this is an debug"));
  console.log();
}

// 0 17 * * * /usr/local/bin/node /path/to/index.js -f
