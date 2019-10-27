'use strict'

/**
 * mask(String value[, String mask = '*'])
 * 给字符串添加掩码
 * ---------------------------------------
 * @param {String} value 要添加掩码的字符串
 * @param {String} mask 掩码
 * ---------------------------------------
 * @return {String}
 * @author Verdient。
 */
let mask = (value, mask) => {
	mask = mask ? mask : '*';
	var result = '';
	if(value){
		value = String(value);
		var length = value.length;
		if(length == 1){
			result = value;
		}else if(length == 2){
			result = value.substr(0, (length - 1)) + mask;
		}else{
			var replace = Math.floor(length / 3) + length % 3;
			var remain = (length - replace) / 2;
			result = value.substr(0, remain) + (new Array(replace + 1).join(mask)) + value.substr((remain + replace), remain);
		}
	}
	return result;
}

/**
 * fixedNumber(Number number, Integer length, Integer decimal)
 * 修改数字长度
 * -----------------------------------------------------------
 * @param {Number} number 数字
 * @param {Integer} length 标准长度
 * @param {Integer} decimal 小数最大长度
 * ------------------------------------
 * @return {String}
 * @author Verdient。
 */
let fixedNumber = (number, length, decimal) => {
	if(!number){
		return "0";
	}
	var fixed = length - String(number).split('.')[0].length;
	if(fixed < 0){
		fixed = 0;
	}
	if(fixed > decimal){
		fixed = decimal;
	}
	var splitNumber = String(number).split('.');
	if(splitNumber[1]){
		var fraction = Number('0.' + String(splitNumber[1]).substr(0, fixed));
		if(fraction == 0){
			return splitNumber[0];
		}else{
			return splitNumber[0] + '.' + String(fraction).split('.')[1];
		}
	}
	return splitNumber[0];
}

/**
 * snakeCase(String value)
 * 将字符串转换为下划线格式
 * -----------------------
 * @param {String} value 待转换的字符串
 * -----------------------------------
 * @return {String}
 * @author Verdient。
 */
let snakeCase = (value) => {
	value = String(value);
	value = value.split('');
	value.forEach((element, index) => {
		if(/^[A-Z]+$/.test(element)){
			value[index] = (index > 0 ? '_' : '') + element.toLowerCase();
		}
	});
	return value.join('');
}

module.exports = {
	mask,
	fixedNumber,
	snakeCase
}