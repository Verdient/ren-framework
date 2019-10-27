'use strict'

const Validator = require('../base/Validator');

/**
 * ArrayValidator
 * 数组校验器
 * --------------
 * @author Verdient。
 */
class ArrayValidator extends Validator
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
		 * 最小大小
		 * -------------
		 * @author Verdient。
		 */
		this.min = null;

		/**
		 * @property max
		 * 最大大小
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
		this.tooSmall = '{attribute} size can not smaller than {min}';

		/**
		 * @property tooBig
		 * 大小过大时的提示
		 * ----------------
		 * @author Verdient。
		 */
		this.tooBig = '{attribute} size can not greater than {max}';

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} must be an array';

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
			if(!Array.isArray(value)){
				revoke(this.message);
			}else{
				let length = value.length;
				if(this.length){
					if(this.length && length != this.length){
						revoke(this.wrongLength);
					}else if(this.min && length < this.min){
						revoke(this.tooShort);
					}else if(this.max && length < this.max){
						revoke(this.tooLong);
					}else{
						resolve();
					}
				}else{
					resolve();
				}
			}
		});
	}
}

module.exports = ArrayValidator;
