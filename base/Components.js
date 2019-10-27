'use strict'

const Class = require('./Class');

/**
 * Components
 * 组件集合
 * ----------
 * @author Verdient。
 */
class Components extends Class
{
	/**
	 * register(Object options)
	 * 注册组件
	 * ------------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @return {Object}
	 * @author Verdient。
	 */
	static register(options){
		let components = this.getComponents();
		for(var i in options){
			components[i] = this.createObject(options[i]);
		}
		return components;
	}

	/**
	 * getComponent(String name)
	 * 获取组件
	 * -------------------------
	 * @param {String} name 名称
	 * ------------------------
	 * @return {Component/Null}
	 * @author Verdient。
	 */
	static getComponent(name){
		let components = this.getComponents();
		if(typeof components[name] != 'undefined'){
			return components[name];
		}
		return null;
	}

	/**
	 * getComponents()
	 * 获取组件集合
	 * ---------------
	 * @return {Object}
	 * @author Verdient。
	 */
	static getComponents(){
		return require('../components/index');
	}
}

module.exports = Components;