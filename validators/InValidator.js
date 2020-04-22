'use strict'

const Validator = require('../base/Validator');
const objectHelper = require('../helpers/object');

/**
 * 范围校验器
 * @author Verdient。
 */
class InValidator extends Validator
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 取值范围
		 * @author Verdient。
		 */
		this.range =  [];

		/**
		 * @property 提示信息
		 * @author Verdient。
		 */
		this.message = '{attribute} must in the following values: {range}';

		return this;
	}

	/**
	 * @inheritdoc
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