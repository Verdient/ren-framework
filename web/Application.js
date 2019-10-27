'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const Component = require('../base/Component');
const Components = require('../base/Components');
const coreConfig = require('../base/config');
const Controllers = require('./Controllers');
const Filters = require('./Filters');
const RequestHandler = require('./handler/RequestHandler');
const objectHelper = require('../helpers/object');
const Validators = require('../base/Validators');

/**
 * defaultConfig
 * 默认配置
 * -------------
 * @author Verdient。
 */
const defaultConfig = {
	http: {
		host: '127.0.0.1',
		port: 80,
		timeout: 60000
	},
	https: {
		host: '127.0.0.1',
		port: 443,
		key: null,
		cert: null,
		timeout: 60000,
	},
	errorHandler: {
		module: '../../web/handler/ErrorHandler',
		multiErrors: false
	}
}

/**
 * Application
 * 应用
 * -----------
 * @author Verdient。
 */
class Application extends Component
{
	/**
	 * initCoreProperty()
	 * 初始化核心属性
	 * ------------------
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	initCoreProperty(){
		super.initCoreProperty();

		/**
		 * @constant EVENT_LISTEN
		 * 监听事件
		 * ----------------------
		 * @author Verdient。
		 */
		this.EVENT_LISTEN = 'listen';

		/**
		 * @constant EVENT_REQUEST
		 * 请求事件
		 * -----------------------
		 * @author Verdient。
		 */
		this.EVENT_REQUEST = 'request';

		/**
		 * @constant EVENT_ERROR
		 * 错误事件
		 * ----------------------
		 * @author Verdient。
		 */
		this.EVENT_ERROR = 'error';

		return this;
	}

	/**
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @inheritdoc
	 * -----------
	 * @return {Object}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @var config
		 * 配置信息
		 * -----------
		 * @author Verdient。
		 */
		this.config = {};

		/**
		 * @var requestHandler
		 * 请求处理器
		 * -------------------
		 * @author Verdient。
		 */
		this.requestHandler = null;

		return this;
	}

	/**
	 * init()
	 * 初始化
	 * -----
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	init(){
		this.config = objectHelper.merge(coreConfig, defaultConfig, this.options);
		this.validateConfig(this.config);
		Components.register(this.config.components);
		Validators.register(this.config.validators);
		Filters.register(this.config.filters);
		Controllers.register();
		this.requestHandler = new RequestHandler(this.config);
		return super.init();
	}

	/**
	 * events()
	 * 事件设置
	 * --------
	 * @inheritdoc
	 * -----------
	 * @return {Object}
	 * @author Verdient。
	 */
	events(){
		return {
			[this.EVENT_LISTEN]: (host, port) => {
				this.info('Application listen on ' + host + ':' + port + ' succeed');
			},
			[this.EVENT_ERROR]: (error) => {
				this.error(error);
			},
			[this.EVENT_REQUEST]: (request, response) => {
				this.trace(request.method + ' ' + request.url);
			}
		}
	}

	/**
	 * run()
	 * 运行
	 * -----
	 * @author Verdient。
	 */
	run(){
		this.listen({
			http: {
				host: this.config.http.host,
				port: this.config.http.port,
				timeout: this.config.http.timeout
			},
			https: {
				host: this.config.https.host,
				port: this.config.https.port,
				key: this.config.https.key,
				cert: this.config.https.cert,
				timeout: this.config.https.timeout
			}
		});
	}

	/**
	 * validateConfig(Object)
	 * 校验配置
	 * ----------------------
	 * @param {Object} config 配置
	 * ---------------------------
	 * @author Verdient。
	 */
	validateConfig(config){
		let http = config.http;
		if(isNaN(http.port) || http.port < 0 || http.port > 65535){
			throw new Error('Application listen port must be an effective port number');
		}
		let https = config.https;
		if(isNaN(https.port) || https.port < 0 || https.port > 65535){
			throw new Error('Application listen port must be an effective port number');
		}
	}

	/**
	 * listen(Object options)
	 * 监听
	 * ----------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @author Verdient。
	 */
	listen(options){
		this.listenHttp(options.http);
		this.listenHttps(options.https);
	}

	/**
	 * listenHttp(Object options)
	 * 监听HTTP
	 * --------------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @author Verdient。
	 */
	listenHttp(options){
		let server = http.createServer();
		server.on('request', (request, response) => {
			this.handleRequest(request, response);
			this.trigger(this.EVENT_REQUEST, request, response);
		});
		server.on('error', (error) => {
			this.trigger(this.EVENT_ERROR, error);
		});
		server.setTimeout(options.timeout);
		delete options.timeout;
		server.listen(options, () => {
			this.trigger(this.EVENT_LISTEN, options.host, options.port);
		});
	}

	/**
	 * listenHttps(Object options)
	 * 监听HTTPS
	 * ---------------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @author Verdient。
	 */
	listenHttps(options){
		if(options.key && options.cert){
			let server = https.createServer({
				key: fs.readFileSync(options.key),
				cert: fs.readFileSync(options.cert)
			});
			server.on('request', (request, response) => {
				this.handleRequest(request, response);
				this.trigger(this.EVENT_REQUEST, request, response);
			});
			server.on('error', (error) => {
				this.trigger(this.EVENT_ERROR, error);
			});
			server.setTimeout(options.timeout);
			delete options.timeout;
			server.listen(options, () => {
				this.trigger(this.EVENT_LISTEN, options.host, options.port);
			});
		}
	}

	/**
	 * handleRequest(IncomingMessage request, ServerResponse response)
	 * 处理请求
	 * ---------------------------------------------------------------
	 * @param {IncomingMessage} request 请求对象
	 * @param {ServerResponse} response 处理对象
	 * -----------------------------------------
	 * @author Verdient。
	 */
	handleRequest(request, response){
		this.requestHandler.handle(request, response);
	}
}

module.exports = Application;