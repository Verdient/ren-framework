'use strict'

const Validator = require('../base/Validator');
const InvalidConfigError = require('../errors/InvalidConfigError');

/**
 * CustomValidator
 * 自定义校验器
 * ---------------
 * @author Verdient。
 */
class CustomValidator extends Validator
{
	/**
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property validator
		 * 校验器
		 * -------------------
		 * @author Verdient。
		 */
		this.validator = null;

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} is invalid';
		return this;
	}

	/**
	 * validateValue(Mixed value)
	 * 校验值
	 * --------------------------
	 * @param Mixed value 待校验的值
	 * ---------------------------
	 * @inheritdoc
	 * -----------
	 * @return {Promise}
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
