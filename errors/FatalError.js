'use strict'

const BaseError = require('../base/BaseError');

/**
 * FatalError
 * 致命错误
 * ----------
 * @author Verdient。
 */
class FatalError extends BaseError
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
		return 'Fatal Error';
	}
}

module.exports = FatalError;