  var moment = require('moment');

 var time_left_in_seconds = function(despawn_timestamp) {
    return (get_expiration_date(despawn_timestamp) - moment()) / 1000;
  };
  module.exports.time_left_in_seconds = time_left_in_seconds;

  module.exports.get_expiration_date = function(despawn_timestamp) {
    return moment.unix(despawn_timestamp).subtract(new Date().getTimezoneOffset(), 'minutes');
  };
