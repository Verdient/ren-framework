'use strict'

const UserError = require('../../errors/UserError');

/**
 * HttpError
 * HTTP错误
 * ---------
 * @author Verdient。
 */
class HttpError extends UserError
{
	/**
	 * constructor(String message, Integer status, Mixed data)
	 * 构造函数
	 * -------------------------------------------------------
	 * @param {String} message 错误信息
	 * @param {Integer} status 状态码
	 * @param {Mixed} data 附加的数据
	 * -------------------------------
	 * @inheritdoc
	 * -----------
	 * @author Verdient。
	 */
	constructor(message, status, data){
		super(message, data);
		this._status = status;
	}

	/**
	 * @getter status
	 * 获取状态码
	 * --------------
	 * @return String
	 * @author Verdient。
	 */
	get status(){
		return this._status;
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
		return 'Http Error';
	}
}

module.exports = HttpError;