const BreakError = require('../errors/BreakError');
const Filter = require('../Filter');
const objectHelper = require('../../helpers/object');

/**
 * Cors
 * CORS过滤器
 * ---------
 * @author Verdient。
 */
class Cors extends Filter
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
		this.routers = '*';
		this['Access-Control-Allow-Origin'] = ['*'];
		this['Access-Control-Allow-Methods'] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
		this['Access-Control-Allow-Headers'] = ['*'];
		this['Access-Control-Allow-Credentials'] = true;
		this['Access-Control-Max-Age'] = 86400;
		this['Access-Control-Expose-Headers'] = [];
		return this;
	}

	/**
	 * filter(Request request, Response response)
	 * 过滤
	 * ------------------------------------------
	 * @param {Request} request 请求
	 * @param {Response} response 响应
	 * -------------------------------
	 * @inheritdoc
	 * -----------
	 * @return {Promise}
	 * @author Verdient。
	 */
	filter(request, response){
		return new Promise((resolve, revoke) => {
			this.filterOrigin(request, response)
				.filterMethod(response)
				.filterCredentials(response)
				.filterAllowHeaders(request, response)
				.filterMaxAge(response);
			if(this.isPreflightRequest(request)){
				revoke(new BreakError(''));
			}else{
				resolve();
			}
		});
	}

	/**
	 * filterOrigin(Request request, Response response)
	 * 过滤域
	 * ------------------------------------------------
	 * @param {Request} request 请求
	 * @param {Response} response 响应
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	filterOrigin(request, response){
		let origin = request.origin;
		if(origin && (objectHelper.inArray(origin, this['Access-Control-Allow-Origin']) || objectHelper.inArray('*', this['Access-Control-Allow-Origin']))){
			response.setHeader('Access-Control-Allow-Origin', origin);
		}
		return this;
	}

	/**
	 * filterMethod(Response response)
	 * 过滤请求方法
	 * -------------------------------
	 * @param {Response} response 响应
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	filterMethod(response){
		response.setHeader('Access-Control-Allow-Methods', this['Access-Control-Allow-Methods'].join(', '));
		return this;
	}

	/**
	 * filterCredentials(Response response)
	 * 过滤证书
	 * ------------------------------------
	 * @param {Response} response 响应
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	filterCredentials(response){
		response.setHeader('Access-Control-Allow-Credentials', this['Access-Control-Allow-Credentials']);
		return this;
	}

	/**
	 * filterMaxAge(Response response)
	 * 过滤过期时间
	 * -------------------------------
	 * @param {Response} response 响应
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	filterMaxAge(response){
		response.setHeader('Access-Control-Max-Age', this['Access-Control-Max-Age']);
		return this;
	}

	/**
	 * filterAllowHeaders(Request request, Response response)
	 * 过滤允许的头部
	 * ------------------------------------------------------
	 * @param {Request} request 请求
	 * @param {Response} response 响应
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	filterAllowHeaders(request, response){
		let requestHeaders = request.getHeader('Access-Control-Request-Headers');
		if(requestHeaders){
			if(objectHelper.inArray('*', this['Access-Control-Allow-Headers'])){
				response.setHeader('Access-Control-Allow-Headers', requestHeaders);
			}else{
				response.setHeader('Access-Control-Allow-Headers', this['Access-Control-Allow-Headers'].join(', '));
			}
		}
		return this;
	}

	/**
	 * filterExposeHeaders(Response response)
	 * 过滤暴露的头部
	 * --------------------------------------
	 * @param {Response} response 响应
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	filterExposeHeaders(response){
		response.setHeader('Access-Control-Expose-Headers', this['Access-Control-Expose-Headers'].join(', '));
		return this;
	}

	/**
	 * isPreflightRequest(Request request)
	 * 是否是预检请求
	 * -----------------------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	isPreflightRequest(request){
		return request.isOptions && request.hasHeader('Access-Control-Request-Method');
	}
}

module.exports = Cors;