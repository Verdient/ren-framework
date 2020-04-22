'use strict'

const NumberValidator = require('./NumberValidator');

/**
 * 整数校验器
 * @author Verdient。
 */
class IntegerValidator extends NumberValidator
{
	/**
	 * @inheritdoc
	 * @return {Self}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = '{attribute} must be an integer';

		return this;
	}

	/**
	 * @inheritdoc
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