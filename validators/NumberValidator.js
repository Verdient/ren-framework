'use strict'

const Validator = require('../base/Validator');

/**
 * NumberValidator
 * 数字校验器
 * ---------------
 * @author Verdient。
 */
class NumberValidator extends Validator
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
		 * @property min
		 * 最小值
		 * -------------
		 * @author Verdient。
		 */
		this.min = null;

		/**
		 * @property max
		 * 最大值
		 * -------------
		 * @author Verdient。
		 */
		this.max = null;

		/**
		 * @property tooSmall
		 * 大小过小时的提示
		 * ------------------
		 * @author Verdient。
		 */
		this.tooSmall = '{attribute} can not smaller than {min}';

		/**
		 * @property tooBig
		 * 大小过大时的提示
		 * ----------------
		 * @author Verdient。
		 */
		this.tooBig = '{attribute} can not greater than {max}';

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} must be an number';

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
