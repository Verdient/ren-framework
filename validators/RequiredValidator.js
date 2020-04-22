'use strict'

const Validator = require('../base/Validator');

/**
 * 必须校验器
 * @author Verdient。
 */
class RequiredValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 是否必须
		 * @author Verdient。
		 */
		this.required = true;

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = this.empty;

		return this;
	}
}

module.exports = RequiredValidator;