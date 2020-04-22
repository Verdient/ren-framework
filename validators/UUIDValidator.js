'use strict'

const Validator = require('../base/Validator');
const InvalidConfigError = require('../errors/InvalidConfigError');

/**
 * UUID校验器
 * @author Verdient。
 */
class UUIDValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 版本
		 * @author Verdient。
		 */
		this.version = null;

		/**
		 * @property 正则
		 * @author Verdient。
		 */
		this.patterns = {
			1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
			3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
			4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
			5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
			all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
		};

		/**
		 * @property 错误信息
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid uuid{version}';

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	validateValue(value){
		return new Promise((resolve, revoke) => {
			let version = this.version || 'all';
			if(typeof this.patterns[version] === 'undefined'){
				revoke(new InvalidConfigError('unsupported uuid version: ' + version));
			}else{
				let pattern = this.patterns[version];
				if(typeof value != 'string' || !pattern || !pattern.test(value)){
					return revoke(this.message);
				}else{
					resolve();
				}
			}
		});
	}
}

module.exports = UUIDValidator;