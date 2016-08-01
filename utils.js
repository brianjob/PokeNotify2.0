  var moment = require('moment');

 var time_left_in_seconds = function(despawn_timestamp) {
    return Math.round((moment.utc(despawn_timestamp * 1000) - moment.utc()) / 1000);
  };
  module.exports.time_left_in_seconds = time_left_in_seconds;

  var get_est_expiration_date = function(despawn_timestamp) {
    return moment.utc(despawn_timestamp * 1000).subtract(4, 'hours');
  };
  module.exports.get_expiration_date = get_expiration_date;