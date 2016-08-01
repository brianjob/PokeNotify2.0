var express = require('express');
var redis = require('redis');
var notify = require('../notify');
var utils = require('../utils');
var router = express.Router();
var redis_client = redis.createClient({url: process.env.REDISCLOUD_URL});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/update', function(req, res, next) {
  console.log('recieved update');
  console.log(JSON.stringify(req.body));

  var message = req.body.message;
  var type = req.body.type;

  if (type === 'pokemon') {
    var redis_key = message.spawnpoint_id;
    var redis_val = message;
    var duration = utils.time_left_in_seconds(message.disappear_time);

    console.log('Pokemon will despawn in ' + duration + ' seconds.');

    redis_client.exists(redis_key, function(err, reply) {
      if (err) throw err;

      if (reply === 0)
        notify(redis_val);

      if (duration > 0) {
        redis_client.setex(redis_key, duration, JSON.stringify(redis_val), function(err, reply) {
          if (err) throw err;
          res.sendStatus(200);
        });
      }
    });
  }
});

module.exports = router;
