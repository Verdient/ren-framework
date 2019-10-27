'use strict'

const NumberValidator = require('./NumberValidator');

/**
 * IntegerValidator
 * 整数校验器
 * ----------------
 * @author Verdient。
 */
class IntegerValidator extends NumberValidator
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
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} must be an integer';

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
			super.validateValue(value).then(() => {
				if(Number(value) % 1 !== 0){
					revoke(this.message);
				}else{
					resolve();
				}
			}).catch(revoke);
		});
	}
}

module.exports = IntegerValidator;