'use strict'

const Validator = require('../base/Validator');

/**
 * 版本校验器
 * @author Verdient。
 */
class VersionValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 分隔符
		 * @author Verdient。
		 */
		this.separator = '.';

		/**
		 * @property 长度
		 * @author Verdient。
		 */
		this.length = 3;

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid version number';

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	validateValue(value){
		return new Promise((resolve, revoke) => {
			if(typeof value !== 'string' || value.split(this.separator).length != this.length){
				revoke(this.message);
			}else{
				resolve();
			}
		});
	}
}

module.exports = VersionValidator;