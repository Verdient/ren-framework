'use strict'

const Url = require('url');
const Class = require('../base/Class');
const BadRequestError = require('../web/errors/BadRequestError');
const httpHelper = require('../helpers/http');
const Router = require('./Router');

/**
 * Request
 * 请求
 * -------
 * @author Verdient。
 */
class Request extends Class
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
		 * @var parser
		 * 解析器
		 * -----------
		 * @author Verdient。
		 */
		this.parser = {
			'application/json': '../parser/JSON',
		};

		/**
		 * @var router
		 * 路由组件
		 * -----------
		 * @author Verdient。
		 */
		this.router = {};

		/**
		 * @var request
		 * 原始请求对象
		 * ------------
		 * @author Verdient。
		 */
		this.request = null;

		/**
		 * @var _headers
		 * 头部信息
		 * -------------
		 * @author Verdient。
		 */
		this._headers = null;

		/**
		 * @var _urlParsed
		 * 解析过的URL
		 * ---------------
		 * @author Verdient。
		 */
		this._urlParsed = null;

		/**
		 * @var _query
		 * 查询参数
		 * -----------
		 * @author Verdient。
		 */
		this._query = null;

		/**
		 * @var _path
		 * 路径
		 * ----------
		 * @author Verdient。
		 */
		this._path = null;

		/**
		 * @var _body
		 * 消息体
		 * ----------
		 * @author Verdient。
		 */
		this._body = null;

		/**
		 * @var _contentType
		 * 消息体类型
		 * -----------------
		 * @author Verdient。
		 */
		this._contentType = null;

		/**
		 * @var _acceptSeries
		 * 接受的序列
		 * ------------------
		 * @author Verdient。
		 */
		this._acceptSeries = null;

		/**
		 * @var _requestController
		 * 请求的控制器
		 * -----------------------
		 * @author Verdient。
		 */
		this._requestController = null;

		/**
		 * @var _requestAction
		 * 请求的动作
		 * -------------------
		 * @author Verdient。
		 */
		this._requestAction = null;

		return this;
	}

	/**
	 * init()
	 * 初始化
	 * ------
	 * @author Verdient。
	 */
	init(){
		super.init();
		this.router.request = this;
		this.router = new Router(this.router);
		return this;
	}

	/**
	 * @getter urlParsed()
	 * 解析过的URL
	 * -------------------
	 * @return {Object}
	 * @author Verdient。
	 */
	get urlParsed(){
		if(this._urlParsed === null){
			this._urlParsed = Url.parse(this.request.url);
		}
		return this._urlParsed;
	}

	/**
	 * @get headers()
	 * 获取头部
	 * --------------
	 * @return {String}
	 * @author Verdient。
	 */
	get headers(){
		if(this._headers === null){
			this._headers = this.request.headers;
		}
		return this._headers;
	}

	/**
	 * @getter path()
	 * 获取路径
	 * --------------
	 * @return {String}
	 * @author Verdient。
	 */
	get path(){
		if(this._path === null){
			let url = this.urlParsed;
			if(url.pathname){
				let path = url.pathname;
				if(path !== '/' && path.charAt(path.length - 1) === '/'){
					path = path.substr(0, path.length - 1);
				}
				this._path = path;
			}else{
				this._path = '/';
			}
		}
		return this._path;
	}

	/**
	 * @getter query()
	 * 获取查询参数
	 * ---------------
	 * @return {Object}
	 * @author Verdient。
	 */
	get query(){
		if(this._query === null){
			this._query = {};
			if(this.urlParsed.query){
				let query = decodeURI(this.urlParsed.query);
				query = query.split('&');
				query.forEach(value => {
					var tmp = value.split('=');
					this._query[tmp[0]] = decodeURIComponent(tmp[1]);
				});
			}
		}
		return this._query;
	}

	/**
	 * @getter contentType()
	 * 获取消息体类型
	 * ---------------------
	 * @return {String}
	 * @author Verdient。
	 */
	get contentType(){
		if(this._contentType === null){
			this._contentType = httpHelper.parseContentType(this.getHeader('Content-Type'));
		}
		return this._contentType;
	}

	/**
	 * @getter body()
	 * 获取消息体
	 * --------------
	 * @return {Object}
	 * @author Verdient。
	 */
	get body(){
		if(this._body === null){
			this._body = {};
			if(this.contentType && this.contentType.type){
				let contentType = this.contentType.type;
				if(this.parser[contentType]){
					let parser = require(this.parser[contentType]);
					try{
						this._body = parser(this.rawBody);
					}catch(e){
						this.addError('parse request', new BadRequestError(e.message));
					}
				}else{
					this.addError('parse request', new BadRequestError('Unsupported Content-type: ' + contentType));
				}
			}
		}
		return this._body;
	}

	/**
	 * 获取原始消息体
	 * @getter rawBody
	 * @return {String}
	 * @author Verdient。
	 */
	get rawBody(){
		return this.request.body;
	}

	/**
	 * @getter origin()
	 * 获取域
	 * ----------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	get origin(){
		return this.headers.origin || null;
	}

	/**
	 * @getter ip()
	 * 获取IP地址
	 * ------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	get ip(){
		return this.headers['x-real-ip'] || this.headers['x-forwarded-for'] || this.request.connection.remoteAddress;
	}

	/**
	 * @getter accept()
	 * 获取接受的类型
	 * ----------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	get accept(){
		return this.headers['accept'];
	}

	/**
	 * @getter acceptSeries()
	 * 获取接受的类型集合
	 * ----------------------
	 * @return {Array}
	 * @author Verdient。
	 */
	get acceptSeries(){
		if(this._acceptSeries === null){
			this._acceptSeries = [];
			let accept = this.headers['accept'] || '*/*';
			let acceptObject = {};
			accept = accept.split(',');
			accept.forEach((value, index) => {
				accept[index] = value.split(';');
				if(accept[index].length == 2){
					accept[index][1] = accept[index][1].split('=')[1];
				}else{
					accept[index][1] = 1;
				}
				if(!acceptObject[accept[index][1]]){
					acceptObject[accept[index][1]] = new Set();
				}
				acceptObject[accept[index][1]].add(accept[index][0]);
			});
			let keys = Object.keys(acceptObject).sort((x, y) => {
				if(Number(x) > Number(y)){
					return -1;
				}else if(Number(x) == Number(y)){
					return 0
				}else{
					return 1;
				}
			});
			keys.forEach(key => {
				for(let accept of acceptObject[key]){
					this._acceptSeries.push(accept);
				}
			});
		}
		return this._acceptSeries;
	}

	/**
	 * getHeader(String name)
	 * 获取指定头部信息
	 * ----------------------
	 * @param String name 头名称
	 * ------------------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	getHeader(name){
		name = name.toLowerCase();
		return this.headers[name] || null;
	}

	/**
	 * hasHeader(String name)
	 * 是否存在指定头部信息
	 * ----------------------
	 * @param String name 头名称
	 * ------------------------
	 * @return {String/Null}
	 * @author Verdient。
	 */
	hasHeader(name){
		return this.getHeader(name) !== null;
	}

	/**
	 * @getter method()
	 * 获取请求的方法
	 * ----------------
	 * @return {String}
	 * @author Verdient。
	 */
	get method(){
		return this.request.method;
	}

	/**
	 * isPost()
	 * 获取是否是Post请求
	 * ----------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isPost(){
		return this.method === 'POST';
	}

	/**
	 * isGet()
	 * 获取是否是Get请求
	 * ---------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isGet(){
		return this.method === 'GET';
	}

	/**
	 * isPut()
	 * 获取是否是Put请求
	 * ---------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isPut(){
		return this.method === 'PUT';
	}

	/**
	 * isPatch()
	 * 获取是否是Patch请求
	 * -----------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isPatch(){
		return this.method === 'PATCH';
	}

	/**
	 * isDelete()
	 * 获取是否是Delete请求
	 * ------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isDelete(){
		return this.method === 'DELETE';
	}

	/**
	 * isHead()
	 * 获取是否是Head请求
	 * ----------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isHead(){
		return this.method === 'HEAD';
	}

	/**
	 * isOptions()
	 * 获取是否是Options请求
	 * -------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isOptions(){
		return this.method === 'OPTIONS';
	}

	/**
	 * @getter requestController()
	 * 获取请求的控制器
	 * ---------------------------
	 * @author Verdient。
	 */
	get requestController(){
		if(this._requestController === null){
			this._requestController = this.router.requestController;
		}
		return this._requestController;
	}

	/**
	 * @getter requestAction()
	 * 获取请求的动作
	 * -----------------------
	 * @author Verdient。
	 */
	get requestAction(){
		if(this._requestAction === null){
			this._requestAction = this.router.requestAction;
		}
		return this._requestAction;
	}
}

module.exports = Request;