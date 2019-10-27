'use strict'

const Component = require('../base/Component');

/**
 * Router
 * 路由
 * ------
 * @author Verdient。
 */
class Router extends Component
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
		 * @var controllerSeparator
		 * 控制器分隔符
		 * ------------------------
		 * @author Verdient。
		 */
		this.controllerSeparator = '-';

		/**
		 * @var controllerSeparator
		 * 控制器分隔符
		 * ------------------------
		 * @author Verdient。
		 */
		this.controllerSeparator = '-';

		/**
		 * @var actionSeparator
		 * 动作分隔符
		 * --------------------
		 * @author Verdient。
		 */
		this.actionSeparator = '-';

		/**
		 * @var defaultController
		 * 默认控制器
		 * ----------------------
		 * @author Verdient。
		 */
		this.defaultController = 'site';

		/**
		 * @var defaultAction
		 * 默认动作
		 * ------------------
		 * @author Verdient。
		 */
		this.defaultAction = 'index';

		/**
		 * @var request
		 * 请求对象
		 * ------------
		 * @author Verdient。
		 */
		this.request = {};

		return this;
	}

	/**
	 * @getter requestController()
	 * 获取请求的控制器
	 * ---------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	get requestController(){
		let path = this.request.path.split('/');
		let requestRouter = [];
		if(path[1]){
			path[1] = path[1].toLowerCase();
			requestRouter = path[1].split(this.controllerSeparator);
			requestRouter.forEach((value, index) => {
				if(index){
					requestRouter[index] = value.substring(0,1).toUpperCase() + value.substring(1);
				}else{
					requestRouter[index] = value;
				}
			});
		}
		return requestRouter.join('') || this.defaultController;
	}

	/**
	 * @getter requestAction()
	 * 获取请求的动作
	 * -----------------------
	 * @return {String}
	 * @author Verdient。
	 */
	get requestAction(){
		let path = this.request.path.split('/');
		let requestAction = [];
		if(path[2]){
			path[2] = path[2].toLowerCase();
			requestAction = path[2].split(this.actionSeparator);
			requestAction.forEach((value, index) => {
				if(index){
					requestAction[index] = value.substring(0,1).toUpperCase() + value.substring(1);
				}else{
					requestAction[index] = value;
				}
			});
		}
		return requestAction.join('') || this.defaultAction;
	}
}

module.exports = Router;