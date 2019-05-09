var request = require('request');

//var base_url = 'https://yobit.io/api/3';
var base_url = 'https://sumcoinindex.com/rates/price.json';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/rate/' + coin + '_' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body[coin + '_' + exchange]);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/rate/' + coin + '_' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body[coin + '_' + exchange]);
      }
    }
  });
}

function get_orders(exch_rate, coin, exchange, cb) {
  var req_url = base_url + '/rate/' + coin + '_' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == 0) {
      return cb(body.error, null, null);
    } else {
      return cb(null, body[coin + '_' + exchange]['exch_rate'], body[coin + '_' + exchange]['exch_rate']);
    }
  });
}


module.exports = {
  get_data: function(exch_rate, coin, exchange, cb) {
    var error = null;
    get_orders(exch_rate, coin, exchange, function(exch_rate, err, buys, sells) {
      if (err) { error = err; }
      get_trades(exch_rate, coin, exchange, function(exch_rate, err, trades) {
        if (err) { error = err; }
        get_summary(exch_rate, coin, exchange, function(exch_rate, err, stats) {
          if (err) { error = err; }
          return cb(error, {exch_rate, buys: buys, sells: sells, chartdata: [], trades: trades, stats: stats});
        });
      });
    });
  }
};

