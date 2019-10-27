'use strict'

const Component = require('../base/Component');
const InvalidParamError = require('../errors/InvalidParamError');
const objectHelper = require('../helpers/object');

/**
 * Filter
 * 过滤器
 * ------
 * @author Verdient。
 */
class Filter extends Component
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
		 * @var EVENT_BEFORE_FILTER
		 * 过滤前事件
		 * ------------------------
		 * @author Verdient。
		 */
		this.EVENT_BEFORE_FILTER = 'beforeFilter';

		/**
		 * @var EVENT_AFTER_FILTER
		 * 过滤后事件
		 * -----------------------
		 * @author Verdient。
		 */
		this.EVENT_AFTER_FILTER = 'afterFilter';

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
		this.routers = false;
		this.message = 'Forbidden';
		return this;
	}

	/**
	 * isNeed(Request request)
	 * 是否需要过滤
	 * -------------------------
	 * @param {Request} request 请求
	 * ----------------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	isNeed(request){
		if(this.routers){
			if(typeof this.routers == 'object'){
				let controller = request.requestController;
				if(typeof this.routers[controller] !== 'undefined'){
					let action = request.requestAction;
					let actions = this.routers[controller];
					if(actions === '*'){
						return true;
					}else if(Array.isArray(actions) && objectHelper.inArray(action, actions)){
						return true;
					}
				}
			}else if(this.routers === '*'){
				return true;
			}
		}
		return false;
	}

	/**
	 * run(DynamicObject ctx)
	 * 运行
	 * ----------------------
	 * @param {DynamicObject} ctx 上下文
	 * --------------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	run(ctx){
		return new Promise((resolve, revoke) => {
			if(this.isNeed(ctx.request)){
				this.trace('Run filter');
				this.trigger(this.EVENT_BEFORE_FILTER)
					.then(() => this.filter(ctx.request, ctx.response))
					.then(() => this.trigger(this.EVENT_AFTER_FILTER))
					.then(() => {
						this.trace('Pass');
						resolve();
					})
					.catch((error) => {
						this.trace('Reject');
						revoke(error);
					});
			}else{
				this.trace('Skip filter');
				resolve();
			}
		});
	}

	/**
	 * filter(Request request, Response response)
	 * 过滤
	 * ------------------------------------------
	 * @param {request} request 请求
	 * @param {Response} response 响应
	 * -------------------------------
	 * @author Verdient。
	 */
	filter(request, response){
		throw new InvalidParamError('primaryKey method must be overridden by subclasses');
	}
}

module.exports = Filter;