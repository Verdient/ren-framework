'use strict'

const Validator = require('../base/Validator');

/**
 * EmailValidator
 * 电子邮件校验器
 * --------------
 * @author Verdient。
 */
class EmailValidator extends Validator
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
		 * @property pattern
		 * 正则
		 * -----------------
		 * @author Verdient。
		 */
		this.pattern = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid email address';

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
			if(typeof value != 'string' || !this.pattern.test(value)){
				revoke(this.message);
			}else{
				resolve();
			}
		});
	}
}

module.exports = EmailValidator;