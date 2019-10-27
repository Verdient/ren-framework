'use strict'

const Component = require('../../base/Component');

/**
 * ResponseHandler
 * 响应处理器
 * ---------------
 * @author Verdient。
 */
class ResponseHandler extends Component
{
	/**
	 * handle(DynamicObject ctx)
	 * 处理
	 * -------------------------
	 * @param {ServerResponse} ctx 上下文
	 * ---------------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	handle(ctx){
		this.trace('Send response with status code: ' + ctx.response.status);
		return ctx.response.send();
	}
}

module.exports = ResponseHandler;