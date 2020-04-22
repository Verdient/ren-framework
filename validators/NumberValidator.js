'use strict'

const Validator = require('../base/Validator');

/**
 * 数字校验器
 * @author Verdient。
 */
class NumberValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 最小值
		 * @author Verdient。
		 */
		this.min = null;

		/**
		 * @property 最大值
		 * @author Verdient。
		 */
		this.max = null;

		/**
		 * @property 大小过小时的提示
		 * @author Verdient。
		 */
		this.tooSmall = '{attribute} can not smaller than {min}';

		/**
		 * @property 大小过大时的提示
		 * @author Verdient。
		 */
		this.tooBig = '{attribute} can not greater than {max}';

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = '{attribute} must be an number';

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	validateValue(value){
		return new Promise((resolve, revoke) => {
			value = String(value);
			if(isNaN(value)){
				revoke(this.message);
			}else if(value.charAt(value.length - 1) === '.'){
				revoke(this.message);
			}else{
				value = Number(value);
				if(this.min && value < this.min){
					revoke(this.tooSmall);
				}else if(this.max && value > this.max){
					revoke(this.tooBig);
				}else{
					resolve();
				}
			}
		});
	}
}

module.exports = NumberValidator;
