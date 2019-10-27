'use strict'

/**
 * number(Integer min, Integer max)
 * 生成随机数
 * --------------------------------
 * @param Integer min 最小值
 * @param Integer max 最大值
 * -------------------------
 * @return {Integer}
 * @author Verdient。
 */
let number = function(min, max) {
	switch(arguments.length){
		case 1:
			return parseInt(Math.random() * min + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (max - min + 1) + min, 10);
			break;
		default:
			return 0;
			break;
	}
}

/**
 * string(Integer length)
 * 生成随机字符串
 * ----------------------
 * @param Integer length 长度
 * --------------------------
 * @return {Integer}
 * @author Verdient。
 */
let string = (length) => {
	length = length || 32;
	let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	let maxPos = $chars.length;
	let string = '';
	for(i = 0; i < length; i++){
		string += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return string;
}

module.exports = {
	number,
	string
};