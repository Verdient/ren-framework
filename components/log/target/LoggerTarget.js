'use strict'

const Module = require('../../../base/Module');
const objectHelper = require('../../../helpers/object');

/**
 * LoggerTarget
 * 日志目标
 * ------------
 * @author Verdient。
 */
class LoggerTarget extends Module
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
		 * @var levels
		 * 等级
		 * -----------
		 * @author Verdient。
		 */
		this.levels = '*';

		/**
		 * @var categorys
		 * 分类
		 * ---------------
		 * @author Verdient。
		 */
		this.categorys = '*';

		return this;
	}

	/**
	 * levelEnabled(String level)
	 * 等级是否允许
	 * --------------------------
	 * @param {String} level 等级
	 * -------------------------
	 * @return Boolean
	 * @author Verdient。
	 */
	levelEnabled(level){
		if(this.levels == '*'){
			return true;
		}
		return objectHelper.inArray('*', this.levels) || objectHelper.inArray(level, this.levels);
	}

	/**
	 * categoryEnabled(String category)
	 * 等级是否允许
	 * -----------------------------
	 * @param {String} category 分级
	 * ----------------------------
	 * @return Boolean
	 * @author Verdient。
	 */
	categoryEnabled(category){
		if(this.category == '*'){
			return true;
		}
		return objectHelper.inArray('*', this.categorys) || objectHelper.inArray(category, this.categorys);
	}

	/**
	 * log(String level, Mixed data, String category)
	 * 记录日志
	 * ----------------------------------------------
	 * @param {String} level 等级
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * -----------------------------
	 * @author Verdient。
	 */
	log(level, data, category){
		if(this.levelEnabled(level)){
			console.log(data);
		}
	}
}

module.exports = LoggerTarget;