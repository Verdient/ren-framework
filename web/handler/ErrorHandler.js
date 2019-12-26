'use strict'

const Component = require('../../base/Component');
const Errors = require('../../base/Errors');

/**
 * ErrorHandler
 * 错误处理器
 * ------------
 * @author Verdient。
 */
class ErrorHandler extends Component
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
		this.multiErrors = false;
		this.translation = null;
		this.defaultStatus = 500;
		return this;
	}

	/**
	 * handle(DynamicObject ctx)
	 * 处理
	 * -------------------------
	 * @param {DynamicObject} ctx 上下文
	 * --------------------------------
	 * @return ServerResponse
	 * @author Verdient。
	 */
	handle(ctx){
		return new Promise((resolve, revoke) => {
			let response = ctx.response;
			let errors = ctx.errors;
			try{
				if(errors instanceof Errors){
					errors = errors.toOneDimension();
					if(this.multiErrors === true){
						let status = 0;
						let body = {'message': 'There were some mistakes', data: {}};
						errors.forEach(error => {
							if(typeof body['data'][error.name] == 'undefined'){
								body['data'][error.name] = [];
							}
							status = error.error.status;
							body['data'][error.name].push(error.error.message);
						});
						response.status = status || this.defaultStatus;
						response.body = body;
					}else{
						let error = errors[0].error;
						response.status = error.status || this.defaultStatus;
						if(error.message){
							response.body = {
								message: error.message
							};
						}
					}
				}
				if(response.status > 499 && response.status < 599){
					this.error(errors);
				}
				resolve(ctx);
			}catch(error){
				revoke(error);
			}
		});
	}
}

module.exports = ErrorHandler;