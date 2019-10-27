'use strict'

const HttpError = require('./HttpError');

/**
 * BadGateWayError
 * 网关错误
 * ---------------
 * @author Verdient。
 */
class BadGateWayError extends HttpError
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
		super(message || 'BadGate Way', 502, data);
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
		return 'BadGate Way Error';
	}
}

module.exports = BadGateWayError;