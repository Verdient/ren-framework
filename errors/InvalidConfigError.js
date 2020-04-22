'use strict'

const FatalError = require('./FatalError');

/**
 * 配置错误
 * @author Verdient。
 */
class InvalidConfigError extends FatalError
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	get type(){
		return 'Invalid Config Error';
	}
}

module.exports = InvalidConfigError;