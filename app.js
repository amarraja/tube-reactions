var Twit = require("twit")
  , redis = require("redis")
  , fs = require("fs")
  , url = require("url")
  , sentiment = require("./sentiment_analyser")
  , express = require("express");

var config = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf8'));

function configValue(key){
	return process.env[key] || config[key];
}

var T = new Twit({
	consumer_key: configValue("CONSUMER_KEY"),
	consumer_secret: configValue("CONSUMER_SECRET"),
	access_token: configValue("ACCESS_TOKEN"),
	access_token_secret: configValue("ACCESS_TOKEN_SECRET")
});



var redisUrl = url.parse(configValue("REDIS_TO_GO_URL"));
var redisClient = redis.createClient(redisUrl.port, redisUrl.hostname, {no_ready_check: true});
redisClient.auth(redisUrl.auth.split(":")[1], function(){
	console.log("Redis connected");
	startPoll();
});


function startPoll(){
	var stream = T.stream("statuses/filter", { track: "strike" });

	stream.on('tweet', function(tweet) {
		sentiment.analyse(tweet.text).forEach(function(word){
			redisClient.hincrby("words", word, 1, function(){
				notifySentiments();
			});
		});
	});
}

function notifySentiments(){
	console.log("Sentiments updated");
	redisClient.hgetall("words", function(e, words){
		console.log(words);
	});
}

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);


