'use strict'

const Base = require('../base/Base');
const objectHelper = require('../helpers/object');
const Components = require('../base/Components');

/**
 * Instance
 * 实例
 * --------
 * @author Verdient。
 */
class Instance extends Base
{
	/**
	 * ensure(String/Object reference)
	 * 确保是某个实例
	 * -------------------------------
	 * @return {Object}
	 * @author Verdient。
	 */
	static ensure(reference){
		switch(objectHelper.type(reference)){
			case 'string':
				return Components.getComponent(reference);
			case 'object':
				return Base.createObject(reference);
		}
		return null;
	}
}

module.exports = Instance;