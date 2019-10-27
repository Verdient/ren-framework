'use strict'

const Validator = require('../base/Validator');

/**
 * VersionValidator
 * 版本校验器
 * ----------------
 * @author Verdient。
 */
class VersionValidator extends Validator
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
		 * @property separator
		 * 分隔符
		 * -------------------
		 * @author Verdient。
		 */
		this.separator = '.';

		/**
		 * @property length
		 * 长度
		 * ----------------
		 * @author Verdient。
		 */
		this.length = 3;

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid version number';

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
			if(typeof value !== 'string' || value.split(this.separator).length != this.length){
				revoke(this.message);
			}else{
				resolve();
			}
		});
	}
}

module.exports = VersionValidator;