'use strict'

const FatalError = require('./FatalError');

/**
 * 函数错误
 * @author Verdient。
 */
class InvalidMethodError extends FatalError
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	get type(){
		return 'Invalid Method Error';
	}
}

module.exports = InvalidMethodError;