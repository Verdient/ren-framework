'use strict'

const url = require('url');
const Component = require('../../base/Component');

/**
 * ProxyHandler
 * 代理处理器
 * ------------
 * @author Verdient。
 */
class ProxyHandler extends Component
{
	/**
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @inheritdoc
	 * -----------
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @var proxys
		 * 代理处理器
		 * -----------
		 * @author Verdient。
		 */
		this.proxys = {};

		return this;
	}

	/**
	 * init()
	 * 初始化
	 * ------
	 * @inheritdoc
	 * -----------
	 * @author Verdient。
	 */
	init(){
		super.init();
		if(this.proxys.http){
			let Http = require(this.proxys.http);
			this.proxys.http = new Http();
		}
		if(this.proxys.tunneling){
			let Tunneling = require(this.proxys.tunneling);
			this.proxys.tunneling = new Tunneling();
		}
	}

	/**
	 * isProxyRequest(Request request)
	 * 是否是代理请求
	 * -------------------------------
	 * @param {Request} request 请求对象
	 * --------------------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	isProxyRequest(request){
		return this.isHttpProxy(request) || this.isTunnelingProxy(request);
	}

	/**
	 * isHttpProxy(Request request)
	 * 是否是HTTP代理请求
	 * ----------------------------
	 * @param {Request} request 请求对象
	 * --------------------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	isHttpProxy(request){
		let urlParsed = url.parse(request.url);
		return urlParsed.protocol === 'http:';
	}

	/**
	 * isTunnelingProxy(Request request)
	 * 是否是隧道代理请求
	 * ---------------------------------
	 * @param {Request} request 请求对象
	 * --------------------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	isTunnelingProxy(request){
		return request.method === 'CONNECT';
	}

	/**
	 * handle(Request request, ServerResponse/Socket handle, Buffer head)
	 * 是否是隧道代理请求
	 * ------------------------------------------------------------------
	 * @param {Request} request 请求对象
	 * @param {ServerResponse/Socket} handle 处理对象
	 * @param {Buffer} head 头部信息
	 * ---------------------------------------------
	 * @author Verdient。
	 */
	handle(request, handle, head){
		if(this.isTunnelingProxy(request) && this.proxys.tunneling){
			this.proxys.tunneling.proxy(request, handle, head);
		}else if(this.isHttpProxy(request) && this.proxys.http){
			let body = [];
			request.on('data', (buffer) => {
				body.push(buffer);
			});
			request.on('end', () => {
				request.body = Buffer.concat(body).toString();
				this.proxys.http.proxy(request, handle);
			});
		}else{
			handle.end();
		}
	}
}

module.exports = ProxyHandler;