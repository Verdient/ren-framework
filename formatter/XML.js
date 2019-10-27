'use strict';

const xmlbuilder = require('xmlbuilder');

module.exports = (body) => {
	return xmlbuilder.create({response: body}).end();
}