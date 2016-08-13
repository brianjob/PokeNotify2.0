var request = require('request');
var Twitter = require('twitter');
var api_url = 'https://api.groupme.com/v3/bots/post';
var bot_id = process.env.BOT_ID;
var pokemon_names = require('./pokemon_names.json');
var notify_list = require('./pokemon_notify_list.json');
var utils = require('./utils');

var lookup_pokemon_name = function(pokemon_id) {
  return pokemon_names[pokemon_id] || 'unknown pokemon';
};

var get_map_link = function(lat, lng) {
  return 'http://www.google.com/maps/place/' + lat + ',' + lng;
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

var send_tweet = function(text) {
  var config = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  var client = new Twitter(config);
  console.log(JSON.stringify(config));

  client.post('statuses/update', {status: text}, function(error, tweet, response) {
  if (!error) {
    console.log(tweet);
  } else {
    console.error(error);
  }
});
};

var do_notify = function(pokemon_name) {
  return notify_list.notify.split(',').indexOf(pokemon_name) !== -1;
};

var is_rare = function(pokemon_name) {
  return notify_list.rares.split(',').indexOf(pokemon_name) !== -1;
};

var notify = function(pokemon) {
  var pokemon_name = lookup_pokemon_name(pokemon.pokemon_id);

  if (do_notify(pokemon_name)) {
    var msg = 'A wild ' + pokemon_name +
    ' appeared at ' + get_map_link(pokemon.latitude, pokemon.longitude) +
    ' and will remain until ' + get_despawn_time(pokemon.disappear_time);

    send_groupme_message(msg);

    if (is_rare(pokemon_name)) {
      send_tweet(msg);
    }

    console.log(msg);
  }
};

module.exports = notify;

