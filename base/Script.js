'use strict'

const Class = require('./Class');
const InvalidMethodError = require('../errors/InvalidMethodError');

/**
 * 脚本
 * @author Verdient。
 */
class Script extends Class
{
	/**
	 * @inheritdoc
	 * @return {Script}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.components = {};
		return this;
	}

	/**
	 * 运行
	 * @throws {InvalidMethodError}
	 * @author Verdient。
	 */
	run(){
		throw new InvalidMethodError('run() method must be overridden by subclasses');
	}
}

module.exports = Script;