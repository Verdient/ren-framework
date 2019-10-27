'use strict'

let buildQuery = (query) => {
	let result = '';
	for(let i in query){
		result += encodeURIComponent(i) + '=' + encodeURIComponent(query[i]) + '&';
	}
	return result.substr(0, result.length - 1);
}

module.exports = {
	buildQuery
}