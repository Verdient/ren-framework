'use strict'

const BaseError = require('../base/BaseError');
const objectHelper = require('../helpers/object');

/**
 * 错误集合
 * @author Verdient。
 */
class Errors
{
	/**
	 * 构造函数
	 * @return {Errors}
	 * @author Verdient。
	 */
	constructor(){
		this._errors = {};
		return this;
	}

	/**
	 * 新增错误
	 * @param {String} name 名称
	 * @param {Mixed} error 错误信息
	 * @return {Errors}
	 * @author Verdient。
	 */
	addError(name, error){
		if(typeof this._errors[name] == 'undefined'){
			this._errors[name] = [];
		}
		this._errors[name].push(error);
		return this;
	}

	/**
	 * 获取错误
	 * @getter errors
	 * @return Object
	 * @author Verdient。
	 */
	get errors(){
		return this._errors;
	}

	/**
	 * 是否有错误
	 * @return {Boolean}
	 * @author Verdient。
	 */
	hasErrors(){
		return !objectHelper.isEmptyObject(this._errors);
	}

	/**
	 * 获取错误
	 * @param {String} name 名称
	 * @return {String|Null}
	 * @author Verdient。
	 */
	getError(name){
		return this._errors[name] || null;
	}

	/**
	 * 获取第一个错误
	 * @return {Mixed}
	 * @author Verdient。
	 */
	getFirstError(){
		for(let name in this._errors){
			return this._errors[name][0] || null;
		}
		return null;
	}

	/**
	 * 转为一维
	 * @param Errors errors 错误集合
	 * @return {Array}
	 * @author Verdient。
	 */
	toOneDimension(errors){
		errors = errors || this._errors;
		if(errors instanceof Errors){
			errors = errors.errors;
		}
		let result = [];
		for(let name in errors){
			let error = errors[name];
			if(error instanceof Error){
				result.push({
					name,
					error
				});
			}else if(error instanceof Errors){
				result.push(...this.toOneDimension(error))
			}else if(Array.isArray(error)){
				error.forEach(subError => {
					if(subError instanceof Error){
						result.push({
							name,
							error: subError
						});
					}else{
						result.push(...this.toOneDimension(error));
					}
				});
			}else{
				result.push({
					name,
					error: new BaseError(error)
				});
			}
		}
		return result;
	}
}

module.exports = Errors;