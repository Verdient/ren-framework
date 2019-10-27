'use strict'

const Validator = require('../base/Validator');
const url = require('url');

/**
 * UrlValidator
 * 链接校验器
 * -------------
 * @author Verdient。
 */
class UrlValidator extends Validator
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
		 * @var validSchemes
		 * 合法的协议
		 * -----------------
		 * @author Verdient。
		 */
		this.validSchemes = ['http', 'https'];

		/**
		 * @var strict
		 * 是否严格匹配
		 * -----------
		 * @author Verdient。
		 */
		this.strict = false;

		/**
		 * @var pattern
		 * 正则
		 * ------------
		 * @author Verdient。
		 */
		this.pattern = '^({schemes}?://)?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-zA-Z_!~*().;?:@&=+$,%#-]+)+/?)$';

		/**
		 * @var message
		 * 错误信息
		 * ------------
		 * @author Verdient。
		 */
		this.message = '{attribute} is not a valid url';

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
			if(typeof value !== 'string'){
				revoke(this.message);
			}else{
				if(this.strict === true){
					let pattern = this.pattern;
					if(pattern.indexOf('{schemes}') != -1){
						pattern = pattern.replace('{schemes}', this.validSchemes.join('|'));
					}
					pattern = new RegExp(pattern);
					if(typeof value != 'string' || !pattern.test(value)){
						revoke(this.message);
					}else{
						resolve();
					}
				}else{
					let urlParsed = url.parse(value);
					if(urlParsed['protocol'] && urlParsed['host']){
						resolve();
					}else{
						revoke(this.message);
					}
				}
			}
		});
	}
}

module.exports = UrlValidator;