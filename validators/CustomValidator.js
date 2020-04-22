'use strict'

const Validator = require('../base/Validator');
const InvalidConfigError = require('../errors/InvalidConfigError');

/**
 * 自定义校验器
 * @author Verdient。
 */
class CustomValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 校验器
		 * @author Verdient。
		 */
		this.validator = null;

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = '{attribute} is invalid';

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	validateValue(value){
		return new Promise((resolve, revoke) => {
			if(typeof this.validator === 'function'){
				this.validator(value, (error) => {
					if(error){
						revoke(error);
					}else{
						resolve();
					}
				});
			}else{
				revoke(new InvalidConfigError('validator must be a function'));
			}
		});
	}
}

module.exports = CustomValidator;
