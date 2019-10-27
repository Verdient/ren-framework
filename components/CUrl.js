'use strict';

const Request = require('request');
const Component = require('../base/Component');
const objectHelper = require('../helpers/object');
const cookieHelper = require('../helpers/cookie');
const httpHelper = require('../helpers/http');
const InvalidParamError = require('../errors/InvalidParamError');

/**
 * CUrl
 * CUrl 组件
 * ---------
 * @author Verdient。
 */
class CUrl extends Component
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
		this.defaultContentType = 'application/x-www-form-urlencoded';
		this.defaultMethod = 'get';
		this.defaultHeaders = {
			'User-Agent': 'nodejs cUrl agent',
			'Content-Type': this.defaultContentType,
		};
		this.parser = {
			'application/json': '../parser/JSON'
		};
		this.formatter = {
			'application/json': '../formatter/JSON',
			'application/x-www-form-urlencoded': '../formatter/Urlencoded',
			'application/xml': '../formatter/XML'
		}
		this.contentTypeMap = {
			'multipart/form-data': 'formData'
		}
		return this;
	}

	/**
	 * _normalizeOptions(Object options)
	 * 规格化参数
	 * ---------------------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	_normalizeOptions(options){
		return new Promise((resolve, revoke) => {
			for(let i in options){
				if(options[i] === null){
					delete options[i];
				}
			}
			if(!objectHelper.isEmptyObject(options.cookies)){
				options.headers.Cookie = cookieHelper.buildCookies(options.cookies);
			}
			delete options.cookies;
			if(!objectHelper.isEmptyObject(options.content) && !options.body){
				if(this.contentTypeMap[options.contentType]){
					for(let name in options.content){
						if(options.content[name] === null){
							delete options.content[name];
						}
					}
					options[this.contentTypeMap[options.contentType]] = options.content;
				}else if(this.formatter[options.contentType]){
					try{
						let formatter = require(this.formatter[options.contentType]);
						options.body = formatter(options.content);
					}catch(error){
						return revoke(error);
					}
				}else{
					return revoke(new InvalidParamError('Unsupported content type: ' + options.contentType));
				}
			}
			delete options.content;
			delete options.contentType;
			resolve(options);
		});
	}

	/**
	 * _request(Object options)
	 * 请求
	 * ------------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	_request(options){
		return new Promise((resolve, revoke) => {
			setTimeout(() => {
				this._normalizeOptions(options).then(options => {
					Request(options, (error, response) => {
						if(error){
							this.warning({options, error}, 'CUrl');
							revoke(error);
						}else{
							this.trace({options, response: {
								headers: response.headers,
								body: response.body
							}}, 'CUrl');
							let contentType = httpHelper.parseContentType(response.headers['content-type']).type;
							if(this.parser[contentType]){
								let parser = require(this.parser[contentType]);
								response.body = parser(response.body);
							}
							resolve(response);
						}
					}).on('error', error => {
						this.warning({options, error}, 'CUrl');
						revoke(error);
					});
				}).catch(revoke);
			});
		});
	}

	/**
	 * @getter instance()
	 * 获取实例
	 * ------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	get instance(){

		/**
		 * _options
		 * 参数
		 * ---------
		 * @author Verdient。
		 */
		this._options = {
			url: null,
			method: this.defaultMethod,
			headers: this.defaultHeaders,
			body: null,
			content: {},
			qs: {},
			contentType: this.defaultContentType,
			proxy: null,
			cookies: [],
			timeout: 30000
		}

		/**
		 * request(Object options)
		 * 请求
		 * -----------------------
		 * @param {Object} options 参数
		 * ---------------------------
		 * @return {Promise}
		 * @author Verdient。
		 */
		this.request = (options) => {
			options = objectHelper.merge(this._options, options);
			return this._request(options);
		}

		/**
		 * get()
		 * GET请求
		 * ------
		 * @return {Promise}
		 * @author Verdient。
		 */
		this.get = () => {
			return this.request({
				method: 'get'
			});
		}

		/**
		 * post()
		 * POST请求
		 * -------
		 * @return {Promise}
		 * @author Verdient。
		 */
		this.post = () => {
			return this.request({
				method: 'post'
			});
		}

		/**
		 * setOption(String name, Mixed value)
		 * 设置参数
		 * -----------------------------------
		 * @param {String} name 名称
		 * @param {Mixed} value 值
		 * -------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setOption = (name, value) => {
			this._options[name] = value;
			return this;
		}

		/**
		 * setOptions(Object options)
		 * 批量设置参数
		 * --------------------------
		 * @param {Object} options 参数
		 * ----------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setOptions = (options) => {
			for(let name in options){
				this.setOption(name, options[name]);
			}
			return this;
		}

		/**
		 * getOptions()
		 * 获取参数
		 * ------------
		 * @return {Object}
		 * @author Verdient。
		 */
		this.getOptions = () => {
			return this._options;
		}

		/**
		 * getOption(String name)
		 * 获取参数
		 * ----------------------
		 * @param {String} name 名称
		 * ------------------------
		 * @return {Mixed}
		 * @author Verdient。
		 */
		this.getOption = (name) => {
			return this.getOptions()[name];
		}

		/**
		 * setUrl(String url)
		 * 设置地址
		 * ------------------
		 * @param {String} url 地址
		 * -----------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setUrl = (url) => {
			return this.setOption('url', url);
		}

		/**
		 * setHeader(Object header)
		 * 设置头部
		 * ------------------------
		 * @param {Object} header 头部
		 * --------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setHeader = (header) => {
			return this.setOption('headers', header);
		}

		/**
		 * setQuery(Object query)
		 * 设置查询参数
		 * ------------------------
		 * @param {Object} query 查询参数
		 * -----------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setQuery = (query) => {
			return this.setOption('qs', query);
		}

		/**
		 * setContent(Object content)
		 * 设置消息体参数
		 * --------------------------
		 * @param {Object} content 消息体参数
		 * ---------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setContent = (content) => {
			return this.setOption('content', content);
		}

		/**
		 * setBody(Object body)
		 * 设置消息体参数
		 * --------------------
		 * @param {Object} body 消息体参数
		 * -----------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setBody = (body) => {
			return this.setOption('body', body);
		}

		/**
		 * setContentType(Object contentType)
		 * 设置消息体数据类型
		 * ----------------------------------
		 * @param {String} contentType 消息体数据类型
		 * ----------------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setContentType = (contentType) => {
			this.addHeader({'Content-Type': contentType});
			return this.setOption('contentType', contentType);
		}

		/**
		 * setProxy(Mixed proxy)
		 * 设置代理
		 * ---------------------
		 * @param {Mixed} proxy 代理
		 * -------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setProxy = (proxy) => {
			return this.setOption('proxy', proxy);
		}

		/**
		 * setProxy(Array cookies)
		 * 设置代理
		 * -----------------------
		 * @param {Array} cookies cookie集合
		 * --------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setCookies = (cookies) => {
			return this.setOption('cookies', cookies);
		}

		/**
		 * getHeader()
		 * 获取头部参数
		 * -----------
		 * @return {Object}
		 * @author Verdient。
		 */
		this.getHeader = () => {
			return this.getOption('headers');
		}

		/**
		 * getQuery()
		 * 获取查询参数
		 * ----------
		 * @return {Object}
		 * @author Verdient。
		 */
		this.getQuery = () => {
			return this.getOption('qs');
		}

		/**
		 * getContent()
		 * 获取消息体参数
		 * ------------
		 * @return {Object}
		 * @author Verdient。
		 */
		this.getContent = () => {
			return this.getOption('content');
		}

		/**
		 * getBody()
		 * 获取消息体参数
		 * ------------
		 * @return {Object}
		 * @author Verdient。
		 */
		this.getBody = () => {
			return this.getOption('body');
		}

		/**
		 * getProxy()
		 * 获取代理
		 * ----------
		 * @return {Mixed}
		 * @author Verdient。
		 */
		this.getProxy = () => {
			return this.getOption('proxy');
		}

		/**
		 * getCookies()
		 * 获取代理集合
		 * ------------
		 * @return {Array}
		 * @author Verdient。
		 */
		this.getCookies = () => {
			return this.getOption('cookies');
		}

		/**
		 * getDataType()
		 * 获取数据类型
		 * -------------
		 * @return {String}
		 * @author Verdient。
		 */
		this.getDataType = () => {
			return this.getOption('dataType');
		}

		/**
		 * addHeader(Object header)
		 * 添加头部参数
		 * ------------------------
		 * @param {Object} header 头部参数
		 * ------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.addHeader = (header) => {
			return this.setHeader(objectHelper.merge(this.getHeader(), header));
		}

		/**
		 * addQuery(Object query)
		 * 添加查询参数
		 * ----------------------
		 * @param {Object} query 查询参数
		 * -----------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.addQuery = (query) => {
			return this.setQuery(objectHelper.merge(this.getQuery(), query));
		}

		/**
		 * addContent(Object content)
		 * 添加消息体参数
		 * --------------------------
		 * @param {Object} content 消息体参数
		 * ---------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.addContent = (content) => {
			return this.setContent(objectHelper.merge(this.getContent(), content));
		}

		/**
		 * addCookie(Object cookie)
		 * 添加cookie
		 * ------------------------
		 * @param {Object} cookie cookie对象
		 * ---------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.addCookie = (cookie) => {
			let cookies = this.getCookies();
			cookies.push(cookie);
			return this.setCookies(cookies);
		}

		/**
		 * setTimeout(Integer milliseconds)
		 * 设置超时时间
		 * --------------------------------
		 * @param {Integer} milliseconds 毫秒
		 * ----------------------------------
		 * @return {CUrl}
		 * @author Verdient。
		 */
		this.setTimeout = (milliseconds) => {
			return this.setOption('timeout', milliseconds);
		}

		return this;
	}
}

module.exports = CUrl;