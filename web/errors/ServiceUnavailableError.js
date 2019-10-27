'use strict'

const HttpError = require('./HttpError');

/**
 * ServiceUnavailableError
 * 服务不可用错误
 * -----------------------
 * @author Verdient。
 */
class ServiceUnavailableError extends HttpError
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
		super(message || 'Service Unavailable', 503, data);
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
		return 'Service Unavailable';
	}
}

module.exports = ServiceUnavailableError;