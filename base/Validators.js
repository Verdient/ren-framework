'use strict'

const Class = require('./Class');

/**
 * 校验器集合
 * @author Verdient。
 */
class Validators extends Class
{
	/**
	 * 注册校验器
	 * @param {Object} options 校验器集合
	 * @author Verdient。
	 */
	static register(options){
		let validators = this.getValidators();
		for(var i in options){
			if(typeof options[i] == 'string'){
				validators[i] = require(options[i]);
			}
		}
		return validators;
	}

	/**
	 * 获取校验器
	 * @param {name} name 校验器名称
	 * @param {Object} options 校验器参数
	 * @return {Validator}
	 * @author Verdient。
	 */
	static getValidator(name, options){
		let validators = this.getValidators();
		if(typeof validators[name] === 'function'){
			let Validator = validators[name];
			return new Validator(options);
		}
		return false;
	}

	/**
	 * 获取校验器集合
	 * @return {Object}
	 * @author Verdient。
	 */
	static getValidators(){
		return require('../validators/index');
	}
}

module.exports = Validators;