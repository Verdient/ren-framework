'use strict'

const Component = require('../base/Component');
const Errors = require('../base/Errors');
const NotFoundError = require('./errors/NotFoundError');

/**
 * Controller
 * 控制器
 * ----------
 * @author Verdient。
 */
class Controller extends Component
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
		 * @var EVENT_BEFORE_ACTION
		 * 执行动作前的事件
		 * ------------------------
		 * @author Verdient。
		 */
		this.EVENT_BEFORE_ACTION = 'beforeAction';

		/**
		 * @var EVENT_AFTER_ACTION
		 * 执行动作后的事件
		 * -----------------------
		 * @author Verdient。
		 */
		this.EVENT_AFTER_ACTION = 'afterAction';

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
		this.ctx = {};
		this.request = {};
		this.response = {};
		this.next = () => {}
		return this;
	}

	/**
	 * setCtx(ctx)
	 * 设置上下文
	 * --------
	 * @return {Self}
	 * @author Verdient。
	 */
	setCtx(ctx){
		this.ctx = ctx;
		this.request = ctx.request;
		this.response = ctx.response;
		this.bodyParams = ctx.request.body;
		this.queryParams = ctx.request.query;
		this.components = ctx.components;
		return this;
	}

	/**
	 * run(String action)
	 * 运行
	 * ------------------
	 * @param {String} action 动作
	 * --------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	run(action){
		return new Promise((resolve, revoke) => {
			setTimeout(() => {
				this.trigger(this.EVENT_BEFORE_ACTION, action)
					.then(() => this.runAction(action))
					.then((result) => this.trigger(this.EVENT_AFTER_ACTION, result, action))
					.then(resolve)
					.catch(revoke);
			});
		});
	}

	/**
	 * runAction(String action)
	 * 运行动作
	 * ------------------------
	 * @param {String} action 动作
	 * --------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	runAction(action){
		return new Promise((resolve, revoke) => {
			let actionName = 'action' + action.substring(0,1).toUpperCase() + action.substring(1);
			if(typeof this[actionName] == 'function'){
				this.next = (result) => {
					if(result instanceof Error || result instanceof Errors){
						revoke(result);
					}else{
						resolve(result);
					}
				}
				this.trace('Run action ' + action);
				this[actionName]();
			}else{
				revoke(new NotFoundError());
			}
		});
	}
}

module.exports = Controller;