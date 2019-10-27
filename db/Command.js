'use strict'

const mysql = require('mysql2');
const Class = require('../base/Class');
const objectHelper = require('../helpers/object');

/**
 * Command
 * 命令
 * -------
 * @author Verdient。
 */
class Command extends Class
{
	/**
	 * buildQuery()
	 * 构建查询语句
	 * ------------
	 * @author Verdient。
	 */
	static buildQuery(tableName, select, where, groupBy, orderBy, limit, offset){
		let whereSq1 = this.buildWhere(where);
		if(whereSq1.length > 0){
			whereSq1 = ' WHERE ' + whereSq1;
		}
		let sql = this.buildSelect(select) + ' FROM ' + this.buildTableName(tableName) + whereSq1 + this.buildGroupBy(groupBy) + this.buildOrderBy(orderBy)+ this.buildLimit(limit);
		if(limit && offset){
			sql += this.buildOffset(offset);
		}
		return sql + ';';
	}

	/**
	 * buildTableName(String tableName)
	 * 构建表名称
	 * --------------------------------
	 * @param {String} tableName 表名称
	 * -------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildTableName(tableName){
		if(tableName.indexOf('`') === -1){
			tableName = '`' + tableName + '`';
		}
		return tableName;
	}

	/**
	 * buildSelect(Array attributes)
	 * 构建选择字段
	 * -----------------------------
	 * @param {Array} attributes 字段集合
	 * ---------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildSelect(attributes){
		return 'SELECT ' + this.buildAttributes(attributes);
	}

	/**
	 * buildAttributes(Array attributes)
	 * 构建属性
	 * ---------------------------------
	 * @param {Array} attributes 属性集合
	 * ---------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildAttributes(attributes){
		attributes.forEach((attribute, index) => {
			if(attribute.indexOf(' AS ') !== -1){
				attribute = attribute.split(' AS ');
			}else if(attribute.indexOf(' as ') !== -1){
				attribute = attribute.split(' as ');
			}
			if(typeof attribute === 'string'){
				if(attribute.indexOf('`') === -1){
					attributes[index] = '`' + attribute + '`';
				}
			}
			if(Array.isArray(attribute)){
				attribute.forEach((value, index) => {
					if(value.indexOf('`') === -1){
						attribute[index] = '`' + value + '`';
					}
				});
				attributes[index] = attribute.join(' AS ');
			}
		});
		return attributes.join(', ');
	}

	/**
	 * buildWhere(Object where)
	 * 构建条件
	 * ------------------------
	 * @param {Object} where 条件
	 * -------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildWhere(where){
		let result = '';
		let params = [];
		for(let relation in where){
			let n = 0;
			where[relation].forEach(element => {
				switch(objectHelper.type(element)){
					case 'object':
						result += (n > 0 ? ' ' + relation + ' ' : '') + this.buildWhere(element);
						break;
					case 'array':
						let operator = element[0];
						let attribute = element[1];
						if(attribute.indexOf('`') === -1){
							attribute = '`' + attribute + '`';
						}
						element.splice(0, 1);
						element.splice(0, 1);
						result += (n > 0 ? ' ' + relation + ' ' : '') + attribute + ' ' + operator + ' '+ '?'.repeat(element.length);
						params.push(element);
						break;
				}
				n++;
			});
		}
		if(result === ''){
			return '';
		}
		return mysql.format('(' + result + ')', params);
	}

	/**
	 * buildGroupBy(Array groupBy)
	 * 构建分组
	 * ----------------------------
	 * @param {Array} groupBy 分组
	 * ---------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildGroupBy(groupBy){
		if(groupBy && Array.isArray(groupBy) && groupBy.length > 0){
			groupBy.forEach((value, index) => {
				if(value.indexOf('`') === -1){
					groupBy[index] = '`' + value + '`';
				}
			});
			return ' GROUP BY ' + groupBy.join(', ');
		}
		return '';
	}

	/**
	 * buildOrderBy(Array orderBy)
	 * 构建排序
	 * ---------------------------
	 * @param {Array} orderBy 排序方式
	 * ------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildOrderBy(orderBy){
		let temp = [];
		if(orderBy && Array.isArray(orderBy) && orderBy.length > 0){
			orderBy.forEach(value => {
				if(Array.isArray(value)){
					if(value[0].indexOf('`') === -1){
						value[0] = '`' + value[0] + '`';
					}
					if(value[1]){
						value[1] = value[1].toUpperCase();
					}
				}else if(typeof value == 'string'){
					if(value.indexOf('`') === -1){
						value = '`' + value + '`';
					}
				}
				temp.push(Array.isArray(value) ? value.join(' ') : value);
			});
			return ' ORDER BY ' + temp.join(', ');
		}
		return '';
	}

	/**
	 * buildLimit(Integer limit)
	 * 构建数量限制
	 * -------------------------
	 * @param {Integer} limit 数量限制
	 * ------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildLimit(limit){
		if(limit){
			return mysql.format(' LIMIT ?', limit);
		}
		return '';
	}

	/**
	 * buildOffset(Integer offset)
	 * 构建偏移量
	 * ---------------------------
	 * @param {Integer} offset 偏移量
	 * -----------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildOffset(offset){
		if(offset){
			return mysql.format(' OFFSET ?', offset);
		}
		return '';
	}

	/**
	 * buildInsert(String tableName, Array attributes, Array values)
	 * 构建插入语句
	 * -------------------------------------------------------------
	 * @param {String} tableName 表名称
	 * @param {Array} attributes 字段集合
	 * @param {Array} values 内容集合
	 * ---------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildInsert(tableName, attributes, values){
		return 'INSERT INTO ' + this.buildTableName(tableName) + '(' + this.buildAttributes(attributes) + ') VALUES (' + this.buildValues(values) + ');';
	}

	/**
	 * buildUpdate(String tableName, Object attributes)
	 * 构建更新
	 * ------------------------------------------------
	 * @param {String} tableName 表名
	 * @param {Object} attributes 更新的字段
	 * -----------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildUpdate(tableName, attributes, where){
		let whereSq1 = this.buildWhere(where);
		if(whereSq1.length > 0){
			whereSq1 = ' WHERE ' + whereSq1;
		}
		let updates = [];
		for(let name in attributes){
			let value = attributes[name];
			if(name.indexOf('`') === -1){
				name = '`' + name + '`';
			}
			updates.push(name + ' = ' + mysql.format('?', value));
		}
		return 'UPDATE ' + this.buildTableName(tableName) + ' SET ' + updates.join(', ') + whereSq1 + ';';
	}

	/**
	 * buildValues(Array values)
	 * 构建值
	 * -------------------------
	 * @param {Array} values 值集合
	 * ---------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	static buildValues(values){
		values.forEach((value, index) => {
			values[index] = mysql.format('?', value);
		});
		return values.join(', ');
	}
}

module.exports = Command;