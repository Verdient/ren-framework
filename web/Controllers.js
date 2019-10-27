'use strict'

const fs = require('fs');
const path = require('path');
const Component = require('../base/Component');
const Instance = require('../di/Instance');
const NotFoundError = require('./errors/NotFoundError');
const controllers = require('./controllers');

/**
 * Controllers
 * 控制器集合
 * -----------
 * @author Verdient。
 */
class Controllers extends Component
{
	/**
	 * register()
	 * 注册
	 * ----------
	 * @return {Self}
	 * @author Verdient。
	 */
	static register(){
		let realPath = fs.realpathSync('controllers');
		let files = fs.readdirSync('controllers');
		files.forEach((value, index) => {
			files[index] = path.join(realPath, value);
		});
		files.forEach((file) => {
			var routerName = path.basename(file, '.js');
			routerName = routerName.substring(0, 1).toLowerCase() + routerName.substring(1)
			controllers[routerName] = require(file);
		});
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
	static run(ctx){
		return new Promise((resolve, revoke) => {
			let controller = ctx.request.requestController;
			let action = ctx.request.requestAction;
			if(controllers[controller]){
				let Controller = new controllers[controller]();
				Controller.setCtx(ctx);
				Controller.run(action).then(resolve).catch(revoke);
			}else{
				revoke(new NotFoundError());
			}
		});
	}
}

module.exports = Controllers;