'use strict'

const BaseError = require('../base/BaseError');

/**
 * 致命错误
 * @author Verdient。
 */
class FatalError extends BaseError
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	get type(){
		return 'Fatal Error';
	}
}

module.exports = FatalError;