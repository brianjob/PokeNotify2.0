  module.exports.now_utc = function() {
    var now = new Date();
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    return now_utc;
  };

  module.exports.difference_in_seconds = function(date1, date2) {
    return Math.round((date2 - date1) / 1000);
  };

  module.exports.unix_ts_to_date = function(seconds) {
    return new Date(seconds * 1000);
  };