'use strict'

const FatalError = require('./FatalError');

/**
 * InvalidMethodError
 * 函数错误
 * ------------------
 * @author Verdient。
 */
class InvalidMethodError extends FatalError
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
		return 'Invalid Method Error';
	}
}

module.exports = InvalidMethodError;