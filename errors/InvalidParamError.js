'use strict'

const FatalError = require('./FatalError');

/**
 * InvalidParamError
 * 配置错误
 * -----------------
 * @author Verdient。
 */
class InvalidParamError extends FatalError
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
		return 'Invalid Param Error';
	}
}

module.exports = InvalidParamError;