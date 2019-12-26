'use strict'

const Class = require('../base/Class');
const objectHeler = require('../helpers/object');

/**
 * Response
 * 响应
 * --------
 * @author Verdient。
 */
class Response extends Class
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
		this.request = null;
		this.response = null;
		this.RESTful = false;
		this.formatter = {
			'application/json': '../formatter/JSON',
			'application/xml': '../formatter/XML'
		}
		this.defaultContentType = 'application/json';
		this._status = 200;
		this._body = null;
		this._headers = {};
		return this;
	}

	/**
	 * init()
	 * 初始化
	 * ------
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	init(){
		super.init();
		this.detectContentType();
		return this;
	}

	/**
	 * detectContentType()
	 * 判断消息体类型
	 * -------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	detectContentType(){
		let contentType = this.getContentType();
		if(contentType){
			this.setHeader('Content-Type', this.getContentType());
		}
		return this;
	}

	/**
	 * isSent()
	 * 是否已发送
	 * --------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isSent(){
		return this.response.finished;
	}

	/**
	 * isHeadersSent()
	 * 是否已发送头部
	 * ---------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isHeadersSent(){
		return this.response.headersSent;
	}

	/**
	 * @getter status()
	 * 获取状态码
	 * ----------------
	 * @return {Integer}
	 * @author Verdient。
	 */
	get status(){
		return this._status;
	}

	/**
	 * @setter status()
	 * 设置状态码
	 * ----------------
	 * @return {Self}
	 * @author Verdient。
	 */
	set status(status){
		this._status = status;
		return this;
	}

	/**
	 * @getter body()
	 * 获取消息体
	 * --------------
	 * @return {Mixed}
	 * @author Verdient。
	 */
	get body(){
		return this._body;
	}

	/**
	 * @setter body()
	 * 设置消息体
	 * --------------
	 * @return {Self}
	 * @author Verdient。
	 */
	set body(value){
		if(null == value){
			this.removeHeader('Content-Type', 'Content-Length', 'Transfer-Encoding');
		}else{
			let type = objectHeler.type(value);
			switch(type){
				case 'string': case 'number':
					this._body = {message: value};
					break;
				case 'object': case 'array':
					this._body = value;
					break;
				default:
					this.status = 500;
					this.body = 'Response body must be the following type: Object, String, Array, ' + type.substr(0, 1).toUpperCase() + type.substr(1) + ' is unsupported';
					break;
			}
		}
		return this;
	}

	/**
	 * @getter headers()
	 * 获取头部集合
	 * -----------------
	 * @return {Object}
	 * @author Verdient。
	 */
	get headers(){
		return this._headers;
	}

	/**
	 * getHeader(String name)
	 * 获取头部
	 * ----------------------
	 * @param {String} name 头部名称
	 * ----------------------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	getHeader(name){
		return this._headers[name] || null;
	}

	/**
	 * getHeader(String name, String value)
	 * 设置头部
	 * ------------------------------------
	 * @param {String} name 名称
	 * @param {String} value 值
	 * -------------------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	setHeader(name, value){
		this._headers[name] = value;
	}

	/**
	 * removeHeader(...headers)
	 * 移除头
	 * ------------------------
	 * @param {String} headers 名称
	 * ----------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	removeHeader(...headers){
		headers.forEach(header => {
			delete this._headers[header];
		});
	}

	/**
	 * getContentType()
	 * 获取消息体类型
	 * ----------------
	 * @return {String}
	 * @author Verdient。
	 */
	getContentType(){
		let request = this.request;
		let acceptSeries = request.acceptSeries;
		if(acceptSeries.length > 0){
			for(let i of acceptSeries){
				if(typeof this.formatter[i] != 'undefined'){
					return i;
				}
				if(i == '*/*'){
					return this.defaultContentType;
				}
			}
			return false;
		}else{
			return this.defaultContentType;
		}
	}

	/**
	 * send()
	 * 发送
	 * ------
	 * @return {Promise}
	 * @author Verdient。
	 */
	send(){
		return new Promise((resolve, revoke) => {
			let res = this.response;
			res.statusCode = this.RESTful ? this.status : 200;
			for(var i in this.headers){
				res.setHeader(i, this.headers[i]);
			}
			let body = this.body;
			if(body !== null){
				let contentType = this.getHeader('Content-Type');
				if(!this.RESTful && !body.code){
					body = Object.assign({code: this.status}, body);
				}
				if(this.formatter[contentType]){
					try{
						let formatter = require(this.formatter[contentType]);
						body = formatter(body);
					}catch(error){
						return revoke(error);
					}
				}else{
					res.statusCode = 406;
					body = null;
				}
			}
			res.end(body);
			resolve();
		});
	}
}

module.exports = Response;