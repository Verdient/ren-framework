'use strict'

const FatalError = require('./FatalError');

/**
 * InvalidConfigError
 * 配置错误
 * ------------------
 * @author Verdient。
 */
class InvalidConfigError extends FatalError
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
		return 'Invalid Config Error';
	}
}

module.exports = InvalidConfigError;