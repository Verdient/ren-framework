'use strict'

const Class = require('./Class');
const Instance = require('../di/Instance');
const UnprocessableEntityError = require('../web/errors/UnprocessableEntityError');
const objectHelper = require('../helpers/object');

/**
 * 校验器
 * @author Verdient。
 */
class Validator extends Class
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 属性
		 * @author Verdient。
		 */
		this.attribute = 'attribute';

		/**
		 * @property 是否不允许为空
		 * @author Verdient。
		 */
		this.required = false;

		/**
		 * @property 是否在错误时跳过
		 * @author Verdient。
		 */
		this.skipOnError = false;

		/**
		 * @property 导出
		 * @author Verdient。
		 */
		this.export = false;

		/**
		 * @property 校验执行时机
		 * @author Verdient。
		 */
		this.when = null;

		/**
		 * @property 导出
		 * @author Verdient。
		 */
		this.exports = {};

		/**
		 * @property 字段为空时的提示信息
		 * @author Verdient。
		 */
		this.empty = '{attribute} can not be blank';

		/**
		 * @property 提示消息类型
		 * @author Verdient。
		 */
		this.messageType = 'validator';

		/**
		 * @property 多国语组件
		 * @author Verdient。
		 */
		this.i18n = 'i18n';

		/**
		 * @property 错误信息
		 * @author Verdient。
		 */
		this._error = null;

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		super.init();
		this.i18n = Instance.ensure(this.i18n);
		return this;
	}

	/**
	 * 判断是否为空
	 * @param {Mixed} value
	 * @return {Boolean}
	 * @author Verdient。
	 */
	isEmpty(value){
		switch(objectHelper.type(value)){
			case 'array': case 'string':
				return value.length == 0;
			case 'object':
				return objectHelper.isEmptyObject(value);
			case 'undefined':
				return true;
			case 'set': case 'map':
				return value.size == 0;
		}
		return false;
	}

	/**
	 * 设置错误
	 * @setter error
	 * @param {Mixed} error 错误信息
	 * @author Verdient。
	 */
	set error(error){
		if(typeof error === 'string'){
			let params = {};
			Object.keys(this).forEach(property => {
				if(property.charAt(0) !== '_' && typeof this[property] === 'string' || typeof this[property] === 'number'){
					params[property] = this[property];
				}
			});
			error = this.i18n.format(this.messageType, error, params);
			error = new UnprocessableEntityError(error);
		}
		this._error = error;
	}

	/**
	 * 获取错误
	 * @getter error
	 * @return {Error}
	 * @author Verdient。
	 */
	get error(){
		return this._error;
	}

	/**
	 * 是否有错误
	 * @return {Boolean}
	 * @author Verdient。
	 */
	hasError(){
		return this._error !== null;
	}

	/**
	 * 校验属性
	 * @param {Object} model 模型
	 * @param {String} attribute 属性名
	 * @return {Promise}
	 * @author Verdient。
	 */
	validateAttribute(model, attribute){
		this.attribute = attribute;
		let value = model[attribute];
		return new Promise((resolve, revoke) => {
			this.validate(value).then(resolve).catch(revoke);
		});
	}

	/**
	 * 校验
	 * @param {Mixed} value 待校验的值
	 * @return {Promise}
	 * @author Verdient。
	 */
	validate(value){
		return new Promise((resolve, revoke) => {
			if(this.isEmpty(value)){
				if(this.required){
					this.error = this.empty;
					revoke(this.error);
				}else{
					resolve();
				}
			}else{
				this.validateValue(value).then(() => {
					resolve();
				}).catch(error => {
					this.error = error;
					revoke(this.error);
				});
			}
		});
	}

	/**
	 * 校验值
	 * @param {Mixed} value 待校验的值
	 * @return {Promise}
	 * @author Verdient。
	 */
	validateValue(value){
		return new Promise((resolve, revoke) => {
			resolve();
		});
	}
}

module.exports = Validator;