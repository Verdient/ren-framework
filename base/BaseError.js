'use strict'

/**
 * BaseError
 * 错误
 * ---------
 * @author Verdient。
 */
class BaseError extends Error
{
	/**
	 * constructor(String message, Mixed data)
	 * 构造函数
	 * ---------------------------------------
	 * @param {String} message 错误信息
	 * @param {Mixed} data 附加的数据
	 * -------------------------------
	 * @author Verdient。
	 */
	constructor(message, data){
		super(message);
		this._data = data;
	}

	/**
	 * @getter data
	 * 获取数据
	 * ------------
	 * @return {Mixed}
	 * @author Verdient。
	 */
	get data(){
		return this._data;
	}

	/**
	 * @getter type()
	 * 获取错误类型
	 * --------------
	 * @return {String}
	 * @author Verdient。
	 */
	get type(){
		return 'Error';
	}
}

module.exports = BaseError;