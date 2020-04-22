'use strict'

const BaseError = require('../base/BaseError');

/**
 * 用户错误
 * @author Verdient。
 */
class UserError extends BaseError
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	get type(){
		return 'User Error';
	}
}

module.exports = UserError;