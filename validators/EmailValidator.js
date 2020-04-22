'use strict'

const Validator = require('../base/Validator');

/**
 * 电子邮件校验器
 * @author Verdient。
 */
class EmailValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 正则
		 * @author Verdient。
		 */
		this.pattern = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid email address';

		return this;
	}

	/**
	 * @inheritdoc
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