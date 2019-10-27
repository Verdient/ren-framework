'use strict'

const crypto = require('crypto');
const Component = require('../base/Component');
const objectHelper = require('../helpers/object');

/**
 * prepareContent(Object content)
 * 准备消息体
 * ------------------------------
 * @param {Object} content 消息体
 * -----------------------------
 * @return {Object}
 * @author Verdient。
 */
var prepareContent = function(content){
	objectHelper.ksort(content);
	return content;
}

/**
 * calculateContentMd5(Object content)
 * 计算消息体MD5
 * -----------------------------------
 * @param {Object} content 消息体
 * -----------------------------
 * @return {String}
 * @author Verdient。
 */
var calculateContentMd5 = (content) => {
	if(!content || objectHelper.isEmptyObject(content)){
		return '';
	}
	content = prepareContent(content);
	var md5 = crypto.createHash('md5');
	return md5.update(JSON.stringify(content)).digest('hex').toLocaleLowerCase();
}

/**
 * buildSignatureString(Object content)
 * 构建签名字符串
 * ------------------------------------
 * @param {Object} content 消息体
 * -----------------------------
 * @return {String}
 * @author Verdient。
 */
var buildSignatureString = (content, signatureMethod, key) => {
	var contentMd5 = calculateContentMd5(content);
	return (contentMd5 || '') + (signatureMethod || '') + key;
}

/**
 * Signature
 * 签名
 * ---------
 * @author Verdient。
 */
class Signature extends Component
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
		 * @var key
		 * 签名秘钥
		 * --------
		 * @author Verdient。
		 */
		this.key = '';

		return this;
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
			var signatureString = buildSignatureString(content, signatureMethod, this.key);
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