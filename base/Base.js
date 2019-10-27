'use strict'

const Errors = require('./Errors');
const InvalidParamError = require('../errors/InvalidParamError');

/**
 * Base
 * 基类
 * -----
 * @author Verdient。
 */
class Base
{
	/**
	 * constructor(Object options)
	 * 构造函数
	 * ---------------------------
	 * @param {Object} options 参数
	 * ---------------------------
	 * @return {Self}
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
	 * initCoreProperty()
	 * 初始化核心属性
	 * ------------
	 * @return {Self}
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
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @return {Self}
	 * @author Verdient。
	 */
	initProperty(){
		return this;
	}

	/**
	 * injectionProperty(Object options)
	 * 属性注入
	 * ---------------------------------
	 * @param {Object} options 属性
	 * ---------------------------
	 * @return {Self}
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
	 * init()
	 * 初始化
	 * ------
	 * @return {Self}
	 * @author Verdient。
	 */
	init(){
		this.trigger(this.EVENT_INIT);
		return this;
	}

	/**
	 * className()
	 * 获取类名
	 * -----------
	 * @return {String}
	 * @author Verdient。
	 */
	static className(){
		return this.name;
	}

	/**
	 * className()
	 * 获取类名
	 * -----------
	 * @return {String}
	 * @author Verdient。
	 */
	className(){
		return this.constructor.className();
	}

	/**
	 * addError(String name, Error error)
	 * 添加错误
	 * ----------------------------------
	 * @param {String} name 名称
	 * @param {Error} error 错误
	 * -------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	addError(name, error){
		this._errors.addError(name, error);
		return this;
	}

	/**
	 * hasErrors()
	 * 是否有错误
	 * -----------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	hasErrors(){
		return this._errors.hasErrors();
	}

	/**
	 * @getter errors()
	 * 获取错误
	 * ----------------
	 * @return {Errors}
	 * @author Verdient。
	 */
	get errors(){
		return this._errors;
	}

	/**
	 * createObject(String/Array options)
	 * 创建对象
	 * ----------------------------------
	 * @param {String/Array} options 参数
	 * ---------------------------------
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