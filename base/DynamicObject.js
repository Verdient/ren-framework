'use strict'

const Class = require('./Class');

/**
 * DynamicObject
 * 动态对象
 * -------------
 * @author Verdient。
 */
class DynamicObject extends Class
{
	/**
	 * add(String name, Mixed value)
	 * 新增属性
	 * -----------------------------
	 * @param {String} name 名称
	 * @param {Mixed} value 值
	 * -------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	add(name, value){
		if(this[name]){
			this.addError('add property', 'property ' + name + ' already exists');
		}else{
			this[name] = value;
			if(value instanceof Class && value.hasErrors()){
				this.addError('property ' + name + ' error', value.errors);
			}
		}
		return this;
	}
}

module.exports = DynamicObject;