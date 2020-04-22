'use strict'

const FatalError = require('./FatalError');

/**
 * 配置错误
 * @author Verdient。
 */
class InvalidParamError extends FatalError
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	get type(){
		return 'Invalid Param Error';
	}
}

module.exports = InvalidParamError;