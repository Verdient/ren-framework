'use strict'

const Module = require('../../../base/Module');
const objectHelper = require('../../../helpers/object');

/**
 * 日志目标
 * @author Verdient。
 */
class LoggerTarget extends Module
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @var {String|Array} 等级
		 * @author Verdient。
		 */
		this.levels = '*';

		/**
		 * @var {String|Array} 分类
		 * @author Verdient。
		 */
		this.categorys = '*';

		return this;
	}

	/**
	 * 等级是否允许
	 * @param {String} level 等级
	 * @return {Boolean}
	 * @author Verdient。
	 */
	levelEnabled(level){
		if(this.levels == '*'){
			return true;
		}
		return objectHelper.inArray('*', this.levels) || objectHelper.inArray(level, this.levels);
	}

	/**
	 * 分类是否允许
	 * @param {String} category 分级
	 * @return {Boolean}
	 * @author Verdient。
	 */
	categoryEnabled(category){
		if(this.category == '*'){
			return true;
		}
		return objectHelper.inArray('*', this.categorys) || objectHelper.inArray(category, this.categorys);
	}

	/**
	 * 记录日志
	 * @param {String} level 等级
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * @author Verdient。
	 */
	log(level, data, category){}
}

module.exports = LoggerTarget;