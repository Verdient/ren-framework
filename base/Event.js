'use strict'

const events = require('../events');
const InvalidParamError = require('../errors/InvalidParamError');
const asyncHelper = require('../helpers/async');

/**
 * Event
 * 事件
 * -----
 * @author Verdient。
 */
class Event
{
	/**
	 * on(String className, String event, Callable handler)
	 * 事件挂载
	 * ----------------------------------------------------
	 * @param {String} className 类名称
	 * @param {String} event 事件名称
	 * @param {Callable} handler 处理器
	 * -------------------------------
	 * @throws InvalidParamError
	 * @author Verdient。
	 */
	static on(className, event, handler){
		if(typeof handler !== 'function'){
			throw new InvalidParamError('handler must be callable');
		}
		if(!events[className]){
			events[className] = {};
		}
		if(!events[className][event]){
			events[className][event] = [];
		}
		events[className][event].push(handler);
	}

	/**
	 * off(String className, String event, Callable handler)
	 * 事件移除
	 * -----------------------------------------------------
	 * @param {String} className 类名称
	 * @param {String} event 事件名称
	 * @param {Callable} handler 处理器
	 * -------------------------------
	 * @author Verdient。
	 */
	static off(className, event, handler){
		if(events[className] && events[className][event]){
			events[className][event].forEach((value, index) => {
				if(value === handler){
					delete events[className][event][index];
				}
			});
		}
	}

	/**
	 * trigger(String className, String event, Mixed ...params)
	 * 事件触发
	 * --------------------------------------------------
	 * @param {String} className 类名称
	 * @param {String} event 事件名称
	 * @param {Mixed} params 参数
	 * -------------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	static trigger(className, event, ...params){
		return new Promise((resovle, revoke) => {
			if(events[className] && events[className][event]){
				asyncHelper.each(events[className][event], (handler, index, callback) => {
					Promise.resolve(handler(...params)).then((result) => callback(null, result)).catch(callback);
				}).then(() => resovle(...params)).catch(revoke);
			}else{
				resovle(...params);
			}
		});
	}
}

module.exports = Event;