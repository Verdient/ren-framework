'use strict'

const Module = require('../../base/Module');

/**
 * Logger
 * 日志
 * ------
 * @author Verdient。
 */
class Logger extends Module
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
		 * @property level
		 * 等级
		 * ---------------
		 * @author Verdient。
		 */
		this.level = 0;

		/**
		 * @property targets
		 * 目标
		 * -----------------
		 * @author Verdient。
		 */
		this.targets = {};

		return this;
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
		super.init();
		let targets = this.targets;
		for(let i in targets){
			let Target = require(targets[i].module);
			this.targets[i] = new Target(targets[i]);
		}
		return this;
	}

	/**
	 * trace(Mixed data, String category)
	 * 跟踪
	 * ----------------------------------
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * ----------------------------
	 * @author Verdient。
	 */
	trace(data, category){
		this.log('trace', data, category);
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
		this.log('info', data, category);
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
		this.log('warning', data, category);
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
		this.log('error', data, category);
	}

	/**
	 * log(String type, Mixed data, String category)
	 * 错误
	 * ---------------------------------------------
	 * @param String type 类型
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * ----------------------------
	 * @author Verdient。
	 */
	log(type, data, category){
		for(let i in this.targets){
			this.targets[i].log(type, data, category);
		}
	}
}

module.exports = Logger;