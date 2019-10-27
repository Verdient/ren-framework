'use strict'

const BaseError = require('../base/BaseError');

/**
 * UserError
 * 用户错误
 * ---------
 * @author Verdient。
 */
class UserError extends BaseError
{
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
		return 'User Error';
	}
}

module.exports = UserError;