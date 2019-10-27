'use strict'

const Validator = require('../base/Validator');
const objectHelper = require('../helpers/object');

/**
 * InValidator
 * 范围校验器
 * -----------
 * @author Verdient。
 */
class InValidator extends Validator
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
		 * @property range
		 * 取值范围
		 * ---------------
		 * @author Verdient。
		 */
		this.range =  [];

		/**
		 * @property message
		 * 提示信息
		 * -----------------
		 * @author Verdient。
		 */
		this.message = '{attribute} must in the following values: {range}';

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
			if(!objectHelper.inArray(value, this.range)){
				revoke(this.message);
			}else{
				resolve();
			}
		});
	}
}

module.exports = InValidator;