'use strict'

const crypto = require('crypto');
const Component = require('../base/Component');
const objectHelper = require('../helpers/object');

/**
 * 签名
 * @author Verdient。
 */
class Signature extends Component
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 签名秘钥
		 * @author Verdient。
		 */
		this.key = '';

		return this;
	}

	/**
	 * 准备消息体
	 * @param {Object} content 消息体
	 * @return {Object}
	 * @author Verdient。
	 */
	prepareContent(content){
		objectHelper.ksort(content);
		return content;
	}

	/**
	 * 计算消息体MD5
	 * @param {Object} content 消息体
	 * @return {String}
	 * @author Verdient。
	 */
	calculateContentMd5(content){
		if(!content || objectHelper.isEmptyObject(content)){
			return '';
		}
		content = this.prepareContent(content);
		var md5 = crypto.createHash('md5');
		return md5.update(JSON.stringify(content)).digest('hex').toLocaleLowerCase();
	}

	/**
	 * 构建签名字符串
	 * @param {Object} content 消息体
	 * @return {String}
	 * @author Verdient。
	 */
	buildSignatureString(content, signatureMethod, key){
		var contentMd5 = this.calculateContentMd5(content);
		return (contentMd5 || '') + (signatureMethod || '') + key;
	}

	/**
	 * signature(Object content, String signatureMethod)
	 * 签名
	 * -------------------------------------------------
	 * @param {Object} content 消息体
	 * @param {String} signatureMethod 签名方法
	 * ---------------------------------------
	 * @return {String/False}
	 * @author Verdient。
	 */
	signature(content, signatureMethod){
		try{
			var signatureString = this.buildSignatureString(content, signatureMethod, this.key);
			var hash = crypto.createHmac(signatureMethod, this.key);
			var md5 = crypto.createHash('md5');
			let hashString = hash.update(signatureString).digest('hex').toLocaleLowerCase();
			return md5.update(hashString).digest('hex').toLocaleLowerCase();
		}catch(e){
			return false;
		}
	}
}

module.exports = Signature;