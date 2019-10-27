'use strict'

const Base = require('./Base');
const Event = require('./Event');

/**
 * Class
 * 类
 * -----
 * @author Verdient。
 */
class Class extends Base
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
		 * @constant EVENT_INIT
		 * 初始化
		 * --------------------
		 * @author Verdient。
		 */
		this.EVENT_INIT = 'init';

		return this;
	}

	/**
	 * initEvents()
	 * 初始化事件
	 * ------------
	 * @return {Self}
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
	 * init()
	 * 初始化
	 * ------
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	init(){
		this.initEvents();
		return super.init();
	}

	/**
	 * events()
	 * 事件设置
	 * --------
	 * @return {Object}
	 * @author Verdient。
	 */
	events(){
		return {};
	}

	/**
	 * trigger(String event, Callable handler)
	 * 事件挂载
	 * ---------------------------------------
	 * @param {String} event 事件
	 * @param {Callable} handler 处理器
	 * -------------------------------
	 * @author Verdient。
	 */
	on(event, handler){
		return Event.on(this.className(), event, handler);
	}

	/**
	 * trigger(String event, Mixed ...params)
	 * 事件触发
	 * --------------------------------------
	 * @param {String} event 事件
	 * @param {Mixed} params 参数
	 * -------------------------
	 * @author Verdient。
	 */
	trigger(event, ...params){
		return Event.trigger(this.className(), event, ...params);
	}
}

module.exports = Class;