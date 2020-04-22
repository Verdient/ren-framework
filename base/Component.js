'use strict'

const Module = require('./Module');
const Instance = require('../di/Instance');

/**
 * 组件
 * @author Verdient。
 */
class Component extends Module
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.logger = 'logger';
		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		this.logger = Instance.ensure(this.logger);
		return super.init();
	}

	/**
	 * 追踪日志
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * @author Verdient。
	 */
	trace(data, category){
		return this.logger.trace(data, category || this.className());
	}

	/**
	 * 信息日志
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * @author Verdient。
	 */
	info(data, category){
		return this.logger.info(data, category || this.className());
	}

	/**
	 * 警告日志
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * @author Verdient。
	 */
	warning(data, category){
		return this.logger.warning(data, category || this.className());
	}

	/**
	 * 错误日志
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * @author Verdient。
	 */
	error(data, category){
		return this.logger.error(data, category || this.className());
	}
}

module.exports = Component;