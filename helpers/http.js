'use strict'

/**
 * parseContentType(String contentType)
 * 解析消息体类型
 * ------------------------------------
 * @param String contentType 消息体类型
 * ----------------------------------
 * @return {Object}
 * @author Verdient。
 */
let parseContentType = (contentType) => {
	if(typeof contentType !== 'string' || !contentType){
		return {
			type: null,
			params: {}
		}
	}
	contentType = contentType.split(';');
	let result = {};
	result.type = contentType[0].trim();
	result.params = {};
	if(contentType[1]){
		let params = contentType[1].split(',');
		params.forEach(element => {
			element = element.split('=');
			result.params[element[0].trim()] = element[1].trim();
		});
	}
	return result;
}

module.exports = {
	parseContentType
}