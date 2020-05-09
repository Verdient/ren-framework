'use strict';

const http = require('http');
const https = require('https');
const Component = require('ren-framework/base/Component');
const objectHelper = require('ren-framework/helpers/object');
const httpHelper = require('ren-framework/helpers/http');
const InvalidParamError = require('ren-framework/errors/InvalidParamError');

/**
 * 客户端
 * @author Verdient。
 */
class Client extends Component
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.parser = {};
		this.formatter = {};
		this.bodySerializer = 'json';
		this._https = false;
		this._method = 'GET';
		this._url = null;
		this._query = {};
		this._content = null;
		this._headers = {};
		this._body = {};
		return this;
	}

	/**
	 * 设置请求方式
	 * @param {String} method 请求方式
	 * @return {Request}
	 * @auhtor Verdient。
	 */
	set method(method){
		this._method = method.toUpperCase();
		return this;
	}

	/**
	 * 获取请求方式
	 * @return {String}
	 * @author Verdient。
	 */
	get method(){
		return this._method;
	}

	/**
	 * 设置地址链接
	 * @param {String} url 地址链接
	 * @return {Request}
	 * @author Verdient。
	 */
	set url(url){
		this._url = url;
		return this;
	}

	/**
	 * 获取URL
	 * @return {String}
	 * @author Verdient。
	 */
	get url(){
		return this._url;
	}

	/**
	 * 设置头部信息
	 * @param {Object} headers 头部信息
	 * @return {Request}
	 * @author Verdient。
	 */
	set headers(headers){
		this._headers = headers;
		return this;
	}

	/**
	 * 获取头部信息
	 * @return {Object}
	 * @author Verdient。
	 */
	get headers(){
		return this._headers;
	}

	/**
	 * 设置查询参数
	 * @param {Object} query 查询参数
	 * @return {Request}
	 * @author Verdient。
	 */
	set query(query){
		this._query = query;
		return this;
	}

	/**
	 * 获取查询参数
	 * @return {Object}
	 * @author Verdient。
	 */
	get query(){
		return this._query;
	}

	/**
	 * 设置消息体参数
	 * @param {Object} body 消息体参数
	 * @return {Request}
	 * @author Verdient。
	 */
	set body(body){
		this._body = body;
		return this;
	}

	/**
	 * 获取消息体参数
	 * @return {Object}
	 * @author Verdient。
	 */
	get body(){
		return this._body;
	}

	/**
	 * 设置消息体
	 * @param {String} content 消息体
	 * @return {Request}
	 * @author Verdient。
	 */
	set content(content){
		this._content = content;
		return this;
	}

	/**
	 * 获取消息体
	 * @return {Object}
	 * @author Verdient。
	 */
	get content(){
		return this._content;
	}

	/**
	 * 添加头部
	 * @param {String} name 名称
	 * @param {String} value 内容
	 * @return {Request}
	 * @author Verdient。
	 */
	addHeader(name, value){
		let type = typeof this._headers[name];
		switch(type){
			case 'string':
				this._headers[name] = [this._headers[name], value];
				break;
			case 'object':
				this._headers[name].push(value);
				break;
			default:
				this._headers[name] = value;
				break;
		}
		return this;
	}

	/**
	 * 添加消息体
	 * @param {String} name 名称
	 * @param {String} value 内容
	 * @return {Request}
	 * @author Verdient。
	 */
	addBody(name, value){
		this._body[name] = value;
		return this;
	}

	/**
	 * 添加头部
	 * @param {String} name 名称
	 * @param {String} value 内容
	 * @return {Request}
	 * @author Verdient。
	 */
	addQuery(name, value){
		this._query[name] = value;
		return this;
	}

	/**
	 * 格式化消息体
	 * @param {Object} body 消息体
	 * @param {String|Callable} serializer 序列化器
	 * @return {String}
	 * @auhtor Verdient。
	 */
	async normalizeContent(body, serializer){
		let contentType = null;
		switch(typeof serializer){
			case 'string':
				if(typeof this.formatter[serializer] !== 'undefined'){
					let config = this.formatter[serializer];
					serializer = require(config.module);
					contentType = config.contentType;
				}else{
					throw new InvalidParamError('Unkrown serializer: ' + serializer);
				}
				break;
		}
		if(contentType){
			this.addHeader('Content-Type', contentType);
		}
		body = await serializer(body);
		if(typeof body === 'string'){
			this.addHeader('Content-Length', body.length);
			return body;
		}
		return;
	}

	/**
	 * 发送
	 * @return {Promise}
	 * @auhtor Verdient。
	 */
	send(){
		return new Promise(async (resolve, revoke) => {
			let url = new URL(this.url);
			for(let name in this.query){
				url.searchParams.append(name, this.query[name]);
			}
			let data = undefined;
			if(objectHelper.inArray(this.method, ['POST', 'PUT', 'DELETE', 'PATCH'])){
				if(this.content){
					data = this.content;
				}else if(!objectHelper.isEmptyObject(this.body)){
					data = await this.normalizeContent(this.body, this.bodySerializer);
				}
			}
			let options = {
				headers: this.headers,
				method: this.method,
				agent: false
			};
			let httpModule = url.protocol === 'https:' ? https : http;
			let request = httpModule.request(url.toString(), options);
			request.on('response', response => {
				let body = [];
				response.on('data', (chunk) => {
					if(chunk){
						body.push(chunk);
					}
				});
				response.on('end', async () => {
					response.rawContent = Buffer.concat(body).toString();
					response.body = {};
					if(response.headers['content-type']){
						let contentType = httpHelper.parseContentType(response.headers['content-type']);
						if(typeof this.parser[contentType.type] !== 'undefined'){
							let parser = require(this.parser[contentType.type]);
							response.body = await parser(response.rawContent);
						}
					}
					resolve(response);
				});
				response.on('error', revoke);
			});
			request.on('error', revoke);
			request.end(data);
		});
	}
}

/**
 * 请求组件
 * @author Verdient。
 */
class Request extends Component
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.defaultMethod = 'GET';
		this.defaultHeaders = {
			'User-Agent': 'nodejs request agent'
		};
		this.parser = {
			'application/json': '../parser/JSON'
		};
		this.formatter = {
			'json': {
				module: '../formatter/JSON',
				contentType: 'application/json'
			},
			'urlencoded': {
				module: '../formatter/Urlencoded',
				contentType: 'application/x-www-form-urlencoded'
			},
			'xml': {
				module: '../formatter/XML',
				contentType: 'application/xml'
			}
		}
		return this;
	}

	/**
	 * 获取客户端
	 * @return {Client}
	 * @author Verdient。
	 */
	get client(){
		let client = new Client();
		client.method = this.defaultMethod;
		client.headers = objectHelper.clone(this.defaultHeaders);
		client.parser = objectHelper.clone(this.parser);
		client.formatter = objectHelper.clone(this.formatter);
		return client;
	}
}

module.exports = Request;