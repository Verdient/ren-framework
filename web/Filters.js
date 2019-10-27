'use strict'

const Class = require('../base/Class');

/**
 * Filters
 * 过滤器集合
 * --------
 * @author Verdient。
 */
class Filters extends Class
{
	/**
	 * register(Object options)
	 * 注册过滤器
	 * ------------------------
	 * @param {Object} options 过滤器集合
	 * --------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	static register(options){
		let filters = this.getFilters();
		for(var i in options){
			filters[i] = this.createObject(options[i]);
		}
		return this;
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
		let filters = this.getFilters();
		let filtersSet = [];
		for(let i in filters){
			filtersSet.push(filters[i].run(ctx));
		}
		return new Promise((resolve, revoke) => {
			Promise.all(filtersSet).then(resolve).catch(revoke);
		});
	}

	/**
	 * getFilters()
	 * 获取过滤器集合
	 * ------------
	 * @return {Object}
	 * @author Verdient。
	 */
	static getFilters(){
		return require('./filters/index');
	}
}

module.exports = Filters;