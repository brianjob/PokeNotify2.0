var request = require('request');
var api_url = 'https://api.groupme.com/v3/bots/post';
var bot_id = process.env.BOT_ID;
var pokemon_names = require('./pokemon_names.json');
var notify_list = require('./pokemon_notify_list.json');
var utils = require('./utils');

var lookup_pokemon_name = function(pokemon_id) {
  return pokemon_names[pokemon_id] || 'unknown pokemon';
};

var get_map_link = function(lat, lng) {
  return 'http://maps.google.com/maps/place/' + lat + '/@' + lng + ',20z';
};

var get_despawn_time = function(disappear_time) {
  return utils.get_est_expiration_date(disappear_time).format("h:mm:ss A");
};

var send_groupme_message = function(text) {
  if (!process.env.BOT_ID) throw 'BOT_ID not set';

  var request = require('request');
  request.post({
    url: api_url,
    body: JSON.stringify({text: text, bot_id: bot_id })
  }, function(error, response, body) {
    if (error) throw error;
    console.log(body);
  });
};

var do_notify = function(pokemon_name) {
  if (notify_list.notify.split(',').indexOf(pokemon_name) === -1)
    return false;
  
  return true;
};

var notify = function(pokemon) {
  var pokemon_name = lookup_pokemon_name(pokemon.pokemon_id);

  if (do_notify(pokemon_name)) {
    var msg = 'A wild ' + pokemon_name +
    ' appeared at ' + get_map_link(pokemon.latitude, pokemon.longitude) +
    ' and will remain until ' + get_despawn_time(pokemon.disappear_time);

    send_groupme_message(msg);
    console.log(msg);
  }
};

module.exports = notify;

