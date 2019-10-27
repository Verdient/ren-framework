const HttpError = require('./HttpError');

/**
 * AuthenticationError
 * 认证错误
 * -------------------
 * @author Verdient。
 */
class AuthenticationError extends HttpError
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
		super(message || 'Authentication Error', 401, data);
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
		return 'Authentication Error';
	}
}

module.exports = AuthenticationError;