'use strict'

const Validator = require('../base/Validator');

/**
 * MobileValidator
 * 手机号码校验器
 * ---------------
 * @author Verdient。
 */
class MobileValidator extends Validator
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
		this.pattern = /^(13[0-9]|14[57]|15[012356789]|16[678]|17[0135678]|18[0-9]|199)[0-9]{8}$/;

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid mobile number';

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
			if((typeof value != 'string' && typeof value != 'number') || !this.pattern.test(String(value))){
				revoke(this.message);
			}else{
				resolve();
			}
		});
	}
}

module.exports = MobileValidator;