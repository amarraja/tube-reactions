var fs = require("fs");

var words = fs.readFileSync(__dirname + '/words.txt', 'utf8').split("\n");

function analyse(text) {
	var matches = [];
	words.forEach(function(word){
		if (word.length > 0 && text.indexOf(word) != -1){
			matches.push(word);
		}
	});
	return matches;
}

module.exports = {
	analyse: analyse
};