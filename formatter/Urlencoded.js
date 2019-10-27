'use strict'

module.exports = (body) => {
	return new URLSearchParams(body).toString();
}