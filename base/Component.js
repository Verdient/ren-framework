'use strict'

const Module = require('./Module');
const Instance = require('../di/Instance');

/**
 * Component
 * 组件
 * ---------
 * @author Verdient。
 */
class Component extends Module
{
	/**
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @return {Self}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.logger = 'logger';
		return this;
	}

	/**
	 * init()
	 * 初始化
	 * ------
	 * @return {Self}
	 * @author Verdient。
	 */
	init(){
		this.logger = Instance.ensure(this.logger);
		return super.init();
	}

	/**
	 * trace(Mixed data, String category)
	 * 追踪
	 * ----------------------------------
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * ----------------------------
	 * @author Verdient。
	 */
	trace(data, category){
		return this.logger.trace(data, category || this.className());
	}

	/**
	 * info(Mixed data, String category)
	 * 信息
	 * ---------------------------------
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * ----------------------------
	 * @author Verdient。
	 */
	info(data, category){
		return this.logger.info(data, category || this.className());
	}

	/**
	 * warning(Mixed data, String category)
	 * 警告
	 * ------------------------------------
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * ----------------------------
	 * @author Verdient。
	 */
	warning(data, category){
		return this.logger.warning(data, category || this.className());
	}

	/**
	 * error(Mixed data, String category)
	 * 错误
	 * ----------------------------------
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * ----------------------------
	 * @author Verdient。
	 */
	error(data, category){
		return this.logger.error(data, category || this.className());
	}
}

module.exports = Component;