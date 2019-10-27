'use strict'

const Component = require('../base/Component');
const Command = require('./Command');
const objectHelper = require('../helpers/object');
const InvalidConfigError = require('../errors/InvalidConfigError');
const InvalidParamError = require('../errors/InvalidParamError');

/**
 * ActiveQuery
 * 动态查询
 * -----------
 * @author Verdient。
 */
class ActiveQuery extends Component
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
		this.class = null;
		this._db = null;
		this._select = ['*'];
		this._tableName = null;
		this._where = {};
		this._limit = false;
		this._offset = false;
		this._groupBy = false;
		this._orderBy = false;
		this._raw = false;
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
		if(!this.class){
			throw new InvalidParamError('class must be set');
		}
		this._tableName = this.class.tableName();
		this._db = this.class.getDb();
		return this;
	}

	/**
	 * @getter db()
	 * 获取数据库对象
	 * ------------
	 * @return {Connection}
	 * @author Verdient。
	 */
	get db(){
		return this._db;
	}

	/**
	 * rawSql()
	 * 获取源SQL
	 * ---------
	 * @return {String}
	 * @author Verdient。
	 */
	get rawSql(){
		return this.buildSql();
	}

	/**
	 * select(Array attributes)
	 * 选择字段
	 * ------------------------
	 * @param {Array} attributes 字段
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	select(attributes){
		if(Array.isArray(attributes)){
			if(objectHelper.inArray('*', attributes)){
				this._select = ['*'];
			}else{
				this._select = attributes;
			}
		}
		return this;
	}

	/**
	 * formatWhere(Mixed condition, relation)
	 * 格式化检索条件
	 * --------------------------------------
	 * @param {Mixed} condition 条件
	 * @param {Mixed} relation 关系
	 * -----------------------------
	 * @return {Array}
	 * @author Verdient。
	 */
	static formatWhere(condition, relation){
		relation = relation || 'AND';
		let where = {};
		switch(objectHelper.type(condition)){
			case 'object':
				where[relation] = [];
				for(let attribute in condition){
					where[relation].push(['=', attribute, condition[attribute]]);
				}
				break;
			case 'array':
				let firstElement = condition[0].toUpperCase();
				if(objectHelper.inArray(firstElement, ['AND', 'OR'])){
					condition.splice(0, 1);
					where[firstElement] = [];
					condition.forEach(element => {
						where[firstElement].push(this.formatWhere(element));
					});
				}else{
					where[relation] = [];
					where[relation].push(condition);
				}
				break;
		}
		return where;
	}

	/**
	 * formatWhere(Mixed condition, relation)
	 * 格式化检索条件
	 * --------------------------------------
	 * @param {Mixed} condition 条件
	 * @param {Mixed} relation 关系
	 * -----------------------------
	 * @return {Array}
	 * @author Verdient。
	 */
	formatWhere(condition, relation){
		return this.constructor.formatWhere(condition, relation);
	}

	/**
	 * where(Object condition)
	 * 筛选条件
	 * -----------------------
	 * @param {Array} condition 条件
	 * -----------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	where(condition){
		this._where = this.formatWhere(condition);
		return this;
	}

	/**
	 * orderBy(String attribute)
	 * 设置排序
	 * -------------------------
	 * @param {String} attribute 字段
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	orderBy(attribute){
		this._orderBy = attribute;
		return this;
	}

	/**
	 * groupBy(String attribute)
	 * 设置分组
	 * -------------------------
	 * @param {String} attribute 字段
	 * ------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	groupBy(attribute){
		this._groupBy = attribute;
		return this;
	}

	/**
	 * limit(Integer limit)
	 * 设置数量限制
	 * --------------------
	 * @param {Integer} limit 数量
	 * ---------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	limit(limit){
		this._limit = limit;
		return this;
	}

	/**
	 * limit(Integer offset)
	 * 设置数量限制
	 * ---------------------
	 * @param {Integer} offset 偏移量
	 * -----------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	offset(offset){
		this._offset = offset;
		return this;
	}

	/**
	 * filterWhere(Object condition)
	 * 过滤检索条件
	 * -----------------------------
	 * @param {Object} condition 条件
	 * ------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	filterWhere(condition){
		if(typeof this._where['AND'] == 'undefined'){
			this._where['AND'] = {};
		}
		for(let attribute in condition){
			if(typeof condition[attribute] != 'undefined' && condition[attribute] !== null){
				this._where['AND'][attribute] = condition[attribute];
			}
		}
		return this;
	}

	/**
	 * buildSql()
	 * 构建SQL
	 * ----------
	 * @return {String}
	 * @author Verdient。
	 */
	buildSql(){
		return Command.buildQuery(this._tableName, this._select, this._where, this._groupBy, this._orderBy, this._limit, this._offset);
	}

	/**
	 * raw(Boolean raw)
	 * 返回原始数据
	 * ----------------
	 * @param {Boolean} raw 是否返回原始数据
	 * -----------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	raw(raw){
		if(typeof raw !== false){
			raw = true;
		}
		this._raw = raw;
		return this;
	}

	/**
	 * one()
	 * 查询一条记录
	 * ----------
	 * @return {Promise}
	 * @author Verdient。
	 */
	one(){
		return new Promise((resolve, revoke) => {
			this.limit(1);
			let db = this.db;
			let sql = this.rawSql;
			this.trace(sql, 'QUERY SQL');
			if(!db){
				revoke(new InvalidConfigError('model db must be set'));
			}else{
				setTimeout(() => {
					db.query(sql).then(result => {
						if(result[0] && result[0][0]){
							let row = result[0][0];
							if(this._raw){
								resolve(row);
							}else{
								let model = new this.class();
								model.populate(row);
								resolve(model);
							}
						}else{
							resolve(null);
						}
					}).catch(revoke);
				});
			}
		});
	}

	/**
	 * all()
	 * 查询所有记录
	 * ----------
	 * @return {Promise}
	 * @author Verdient。
	 */
	all(){
		return new Promise((resolve, revoke) => {
			let db = this.db;
			let sql = this.rawSql;
			this.trace(sql, 'QUERY SQL');
			if(!db){
				revoke(new InvalidConfigError('model db must be set'));
			}else{
				setTimeout(() => {
					db.query(sql, (error, result) => {
						if(error){
							return revoke(error);
						}
						if(this._raw){
							resolve(result);
						}else{
							let models = [];
							result.forEach(row => {
								let model = new this.class();
								model.populate(row);
								models.push(model);
							});
							resolve(models);
						}
					});
				});
			}
		});
	}
}

module.exports = ActiveQuery;