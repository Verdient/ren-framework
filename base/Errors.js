'use strict'

const BaseError = require('../base/BaseError');
const objectHelper = require('../helpers/object');

/**
 * Errors
 * 错误集合
 * -------
 * @author Verdient。
 */
class Errors
{
	/**
	 * constructor()
	 * 构造函数
	 * -------------
	 * @return {Self}
	 * @author Verdient。
	 */
	constructor(){
		this._errors = {};
		return this;
	}

	/**
	 * addError(String name, Mixed error)
	 * 新增错误
	 * ----------------------------------
	 * @param {String} name 名称
	 * @param {Mixed} error 错误信息
	 * ----------------------------
	 * @return {Self}
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
	 * @getter errors()
	 * 获取错误
	 * ----------------
	 * @return Object
	 * @author Verdient。
	 */
	get errors(){
		return this._errors;
	}

	/**
	 * hasErrors()
	 * 是否有错误
	 * -----------
	 * @return Boolean
	 * @author Verdient。
	 */
	hasErrors(){
		return !objectHelper.isEmptyObject(this._errors);
	}

	/**
	 * getError(String name)
	 * 获取错误
	 * ---------------------
	 * @param {String} name 名称
	 * -------------------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	getError(name){
		return this._errors[name] || null;
	}

	/**
	 * getFirstError()
	 * 获取第一个错误
	 * ---------------
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
	 * toOneDimension(Errors errors)
	 * 转为一维
	 * -----------------------------
	 * @param Errors errors 错误集合
	 * ----------------------------
	 * @return Array
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