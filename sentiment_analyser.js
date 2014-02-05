var fs = require("fs")
  , _ = require("underscore");

var words = _.select(fs.readFileSync(__dirname + '/words.txt', 'utf8').split("\n"),function(word) { return word.length > 0; });

function analyse(text) {
	var textParts = text.toLowerCase().split(/([a-z]+)/)
	return _.intersection(words, textParts);
}

module.exports = {
	analyse: analyse
};