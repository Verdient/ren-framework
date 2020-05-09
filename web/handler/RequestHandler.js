'use strict'

const Component = require('../../base/Component');
const Components = require('../../base/Components');
const Controllers = require('../Controllers');
const DynamicObject = require('../../base/DynamicObject');
const Filters = require('../Filters');
const Model = require('../../base/Model');
const Request = require('../Request');
const Response = require('../Response');
const ResponseHandler = require('./ResponseHandler');

/**
 * 请求处理器
 * @author Verdient。
 */
class RequestHandler extends Component
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @var 错误处理器
		 * @author Verdient。
		 */
		this.errorHandler = {};

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		super.init();
		let ErrorHandler = require(this.errorHandler.module);
		// let Translation = require(this.i18n.module);
		// this.translation = new Translation(this.i18n);
		// this.errorHandler.translation = this.translation;
		this.errorHandler = new ErrorHandler(this.errorHandler);
		this.responseHandler = new ResponseHandler();
	}

	/**
	 * 处理
	 * @param {IncomingMessage} request 请求对象
	 * @param {ServerResponse} response 响应对象
	 * @author Verdient。
	 */
	handle(request, response){
		this.handleRequest(request, response).then(ctx => {
			this.handleResponse(ctx).catch((error) => {
				ctx.addError('response', error);
				this.handleError(ctx).catch(error => {
					this.error(error);
				});
			});
		}).catch(ctx => {
			this.handleError(ctx).catch(error => {
				this.error(error);
			});
		});
	}

	/**
	 * 处理请求
	 * @param {IncomingMessage} request 请求对象
	 * @param {ServerResponse} response 响应对象
	 * @return {Promise}
	 * @author Verdient。
	 */
	handleRequest(request, response){
		return new Promise((resolve, revoke) => {
			let body = [];
			request.on('data', (buffer) => {
				body.push(buffer);
			});
			request.on('end', () => {
				request.body = Buffer.concat(body).toString();
				let ctx = new DynamicObject();
				ctx.add('request', new Request({request}));
				ctx.add('response', new Response({
					request: ctx.request,
					response: response
				}));
				ctx.add('components', Components.getComponents());
				Filters.run(ctx)
					.then(() => Controllers.run(ctx))
					.then((response) => {
						if(response){
							ctx.response.body = this.serialize(response);
						}
						resolve(ctx);
					}).catch(error => {
						ctx.addError('controller', error);
						revoke(ctx);
					});
			});
		});
	}

	/**
	 * 处理错误
	 * @param {DynamicObject} ctx 响应对象
	 * @return {Promise}
	 * @author Verdient。
	 */
	handleError(ctx){
		return new Promise((resolve, revoke) => {
			this.errorHandler.handle(ctx).then(ctx => {
				this.handleResponse(ctx).then(resolve).catch(revoke);
			}).catch((error) => {
				revoke(error);
			});
		});
	}

	/**
	 * 处理响应
	 * @param {DynamicObject} ctx 上下文
	 * @author Verdient。
	 */
	handleResponse(ctx){
		return this.responseHandler.handle(ctx);
	}

	/**
	 * 序列化
	 * @param {Mixed} value 待序列化的数据
	 * @return {Object}
	 * @author Verdient。
	 */
	serialize(value){
		let result;
		if(Array.isArray(value)){
			result = [];
			for(let element of value){
				result.push(this.serialize(element));
			}
		}else if(value instanceof Model){
			result = value.attributes;
		}else{
			result = value;
		}
		return result;
	}
}

module.exports = RequestHandler;