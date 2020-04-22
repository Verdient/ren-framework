'use strict'

const Base = require('./Base');
const Event = require('./Event');

/**
 * 类
 * @author Verdient。
 */
class Class extends Base
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initCoreProperty(){
		super.initCoreProperty();

		/**
		 * @event 初始化
		 * @author Verdient。
		 */
		this.EVENT_INIT = 'init';

		return this;
	}

	/**
	 * @method 初始化事件
	 * @return {Class}
	 * @author Verdient。
	 */
	initEvents(){
		let events = this.events();
		for(let event in events){
			if(Array.isArray(events[event])){
				events[event].forEach(handler => {
					this.on(event, handler);
				});
			}else{
				this.on(event, events[event]);
			}
		}
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		this.initEvents();
		this.trigger(this.EVENT_INIT);
		return super.init();
	}

	/**
	 * 事件设置
	 * @return {Object}
	 * @author Verdient。
	 */
	events(){
		return {};
	}

	/**
	 * 挂载事件
	 * @param {String} event 事件
	 * @param {Callable} handler 处理器
	 * @author Verdient。
	 */
	on(event, handler){
		return Event.on(this.className(), event, handler);
	}

	/**
	 * 触发事件
	 * @param {String} event 事件
	 * @param {Mixed} params 参数
	 * @author Verdient。
	 */
	trigger(event, ...params){
		return Event.trigger(this.className(), event, ...params);
	}
}

module.exports = Class;