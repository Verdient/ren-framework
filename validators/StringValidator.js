'use strict'

const Validator = require('../base/Validator');

/**
 * 字符串校验器
 * @author Verdient。
 */
class StringValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 长度
		 * @author Verdient。
		 */
		this.length = null;

		/**
		 * @property 最小长度
		 * @author Verdient。
		 */
		this.min = null;

		/**
		 * @property 最大长度
		 * @author Verdient。
		 */
		this.max = null;

		/**
		 * @property 长度错误时的提示
		 * @author Verdient。
		 */
		this.wrongLength = '{attribute} length must be {length}';

		/**
		 * @property 长度过短时的提示
		 * @author Verdient。
		 */
		this.tooShort = '{attribute} must longer than {min}';

		/**
		 * @property 长度过长时的提示
		 * @author Verdient。
		 */
		this.tooLong = '{attribute} must shorter than {max}';

		/**
		 * @property 错误提示
		 * @author Verdient。
		 */
		this.message = '{attribute} must be a string';

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	validateValue(value){
		return new Promise((resolve, revoke) => {
			if(typeof value != 'string' && typeof value != 'number'){
				revoke(this.message);
			}else{
				let length = String(value).length;
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

module.exports = StringValidator;