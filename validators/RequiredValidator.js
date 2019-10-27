'use strict'

const Validator = require('../base/Validator');

/**
 * RequiredValidator
 * 必须校验器
 * -----------------
 * @author Verdient。
 */
class RequiredValidator extends Validator
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
		 * @property required
		 * 是否必须
		 * ------------------
		 * @author Verdient。
		 */
		this.required = true;

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = this.empty;

		return this;
	}
}

module.exports = RequiredValidator;