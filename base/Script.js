'use strict'

const Class = require('./Class');
const InvalidMethodError = require('../errors/InvalidMethodError');


/**
 * Script
 * 脚本
 * ------
 * @author Verdient。
 */
class Script extends Class
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
		this.components = {};
		return this;
	}

	/**
	 * run()
	 * 运行
	 * -----
	 * @throws InvalidMethodError
	 * @author Verdient。
	 */
	run(){
		throw new InvalidMethodError('run() method must be overridden by subclasses');
	}
}

module.exports = Script;