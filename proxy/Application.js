'use strict';

const http = require('http');
const Component = require('../base/Component');
const Components = require('../base/Components');
const objectHelper = require('../helpers/object');
const coreConfig = require('../base/config');

/**
 * defaultConfig
 * 默认配置
 * -------------
 * @author Verdient。
 */
const defaultConfig = {
	proxy: {
		host: '127.0.0.1',
		port: 80,
		timeout: 60000,
		proxyHandler: './handler/ProxyHandler'
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
	 * @return {Self}
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
		 * @var proxyHandler
		 * 组件处理器
		 * -----------------
		 * @author Verdient。
		 */
		this.proxyHandler = {};

		return this;
	}

	/**
	 * init()
	 * 初始化
	 * ------
	 * @author Verdient。
	 */
	init(){
		this.config = objectHelper.merge(coreConfig, defaultConfig, this.options);
		this.validateConfig(this.config);
		Components.register(this.config.components);
		let ProxyHandler = require(this.config.proxy.proxyHandler);
		this.proxyHandler = new ProxyHandler(this.config.proxy);
		return super.init();;
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
			host: this.config.proxy.host,
			port: this.config.proxy.port,
			timeout: this.config.proxy.timeout
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
		if(isNaN(config.proxy.port) || config.proxy.port < 0 || config.proxy.port > 65535){
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
		const server = http.createServer();
		server.on('request', (request, response) => {
			this.handleRequest(request, response);
		});
		server.on('connect', (request, sock, head) => {
			this.handleRequest(request, sock, head);
		});
		server.on('error', (error) => {
			this.components.logger.error(error, 'Application');
		});
		server.setTimeout(options.timeout);
		delete options.timeout;
		server.listen(options, () => {
			this.trigger(this.EVENT_LISTEN, options.host, options.port);
		});
	}

	/**
	 * handleRequest(IncomingMessage request, Object handle, Object head)
	 * 处理请求
	 * ------------------------------------------------------------------
	 * @param {IncomingMessage} request 请求对象
	 * @param {Object} handle 处理对象
	 * @param {Object} head 头部信息
	 * -----------------------------------------
	 * @author Verdient。
	 */
	handleRequest(request, handle, head){
		this.proxyHandler.handle(request, handle, head);
	}
}

module.exports = Application;