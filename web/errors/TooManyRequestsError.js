'use strict'

const HttpError = require('./HttpError');

/**
 * TooManyRequestsError
 * 请求过多错误
 * --------------------
 * @author Verdient。
 */
class TooManyRequestsError extends HttpError
{
	/**
	 * constructor(String message, Mixed data)
	 * 构造函数
	 * ---------------------------------------
	 * @param {String} message 错误信息
	 * @param {Mixed} data 附加的数据
	 * -------------------------------
	 * @inheritdoc
	 * -----------
	 * @author Verdient。
	 */
	constructor(message, data){
		super(message || 'Too Many Requests', 429, data);
	}

	/**
	 * @getter type()
	 * 获取错误类型
	 * --------------
	 * @inheritdoc
	 * -----------
	 * @return {String}
	 * @author Verdient。
	 */
	get type(){
		return 'Too Many Requests Error';
	}
}

module.exports = TooManyRequestsError;