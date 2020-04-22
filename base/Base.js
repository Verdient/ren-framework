'use strict'

const Errors = require('./Errors');
const InvalidParamError = require('../errors/InvalidParamError');

/**
 * 基础对象
 * @author Verdient。
 */
class Base
{
	/**
	 * 构造函数
	 * @param {Object} options 参数
	 * @return {Base}
	 * @author Verdient。
	 */
	constructor(options){
		this.initCoreProperty();
		this.initProperty();
		this.injectionProperty(options);
		this.init();
		return this;
	}

	/**
	 * 初始化核心属性
	 * @return {Base}
	 * @author Verdient。
	 */
	initCoreProperty(){

		/**
		 * @var _errors
		 * 错误集合
		 * -----------------
		 * @author Verdient。
		 */
		this._errors = new Errors();

		return this;
	}

	/**
	 * 初始化属性
	 * @return {Self}
	 * @author Verdient。
	 */
	initProperty(){
		return this;
	}

	/**
	 * 属性注入
	 * @param {Object} options 属性
	 * @return {Base}
	 * @author Verdient。
	 */
	injectionProperty(options){
		this.options = options;
		for(let i in options){
			if(i !== 'module' && this.hasOwnProperty(i)){
				this[i] = options[i];
			}
		}
		return this;
	}

	/**
	 * 初始化
	 * @return {Base}
	 * @author Verdient。
	 */
	init(){
		return this;
	}

	/**
	 * 获取类名
	 * @return {String}
	 * @author Verdient。
	 */
	static className(){
		return this.name;
	}

	/**
	 * 获取类名
	 * @return {String}
	 * @author Verdient。
	 */
	className(){
		return this.constructor.className();
	}

	/**
	 * 添加错误
	 * @param {String} name 名称
	 * @param {Error} error 错误
	 * @return {Base}
	 * @author Verdient。
	 */
	addError(name, error){
		this._errors.addError(name, error);
		return this;
	}

	/**
	 * 是否有错误
	 * @return {Boolean}
	 * @author Verdient。
	 */
	hasErrors(){
		return this._errors.hasErrors();
	}

	/**
	 * 获取错误
	 * @getter errors
	 * @return {Errors}
	 * @author Verdient。
	 */
	get errors(){
		return this._errors;
	}

	/**
	 * 创建对象
	 * @param {String|Array} options 参数
	 * @return {Object}
	 * @author Verdient。
	 */
	static createObject(options){
		let type = typeof options;
		let Class;
		switch(type){
			case 'string':
				Class = require(options);
				return new Class();
			case 'object':
				if(!options.module){
					throw new Error('Object configuration must be an array containing a "module" element.');
				}
				Class = require(options.module);
				return new Class(options);
			default:
				throw new InvalidParamError('Unsupported configuration type:' + type);
		}
	}
}

module.exports = Base;