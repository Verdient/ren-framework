'use strict'

/**
 * time2str(String format[, Integer / String timestamp = false])
 * 时间戳转字符串
 * -------------------------------------------------------------
 * @param String format 格式
 * @patam Integer / String timestamp 时间戳
 * ---------------------------------------
 * @return {String}
 * @author Verdient。
 */
let time2str = function(format, timestamp) {
	var dateObject = timestamp ? new Date((!isNaN(timestamp) && String(timestamp).length < 12) ? (timestamp * 1000) : timestamp) : new Date;
	var date = {
		"M+": dateObject.getMonth() + 1,
		"d+": dateObject.getDate(),
		"h+": dateObject.getHours(),
		"m+": dateObject.getMinutes(),
		"s+": dateObject.getSeconds(),
		"q+": Math.floor((dateObject.getMonth() + 3) / 3),
		"S+": dateObject.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (dateObject.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
		}
	}
	return format;
}

/**
 * str2time(String string[, String type = s])
 * 时间戳转字符串
 * ------------------------------------------
 * @param String string 格式
 * @patam String type 类型
 * -------------------------
 * @return {Integer}
 * @author Verdient。
 */
let str2time = function(string, type) {
	type = type ? type: 's';
	string = string.replace(/-/g, '/');
	var timestamp = Date.parse(new Date(string));
	if (isNaN(timestamp)) {
		return '';
	}
	switch (type) {
		case 's':
			return timestamp / 1000;
		case 'ms':
			return timestamp;
		default:
			return '';
	}
}

module.exports = {
	time2str,
	str2time
};