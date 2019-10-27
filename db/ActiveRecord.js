'use strict'

const Model = require('../base/Model');
const Command = require('./Command');
const Components = require('../base/Components');
const InvalidMethodError = require('../errors/InvalidMethodError');
const objectHelper = require('../helpers/object');
const stringHelper = require('../helpers/string');
const ActiveQuery = require('./ActiveQuery');

/**
 * ActiveRecord
 * 动态记录
 * ------------
 * @author Verdient。
 */
class ActiveRecord extends Model
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
		 * @property _isNewRecord
		 * 是否是新纪录
		 * ----------------------
		 * @author Verdient。
		 */
		this._isNewRecord = true;

		return this;
	}

	/**
	 * @getter isNewRecord()
	 * 获取是否是新纪录
	 * ---------------------
	 * @return {Boolean}
	 * @author Verdient。
	 */
	get isNewRecord(){
		return this._isNewRecord;
	}

	/**
	 * tableName()
	 * 表名
	 * -----------
	 * @return {String}
	 * @author Verdient。
	 */
	static tableName(){
		var className = this.className();
		var name = className.substr(className.lastIndexOf('.') + 1);
		return stringHelper.snakeCase(name);
	}

	/**
	 * tableName()
	 * 表名
	 * -----------
	 * @return {String}
	 * @author Verdient。
	 */
	tableName(){
		return this.constructor.tableName();
	}

	/**
	 * getDb()
	 * 获取数据库对象
	 * ------------
	 * @return
	 * @author Verdient。
	 */
	static getDb(){
		let db = Components.getComponent('db');
		if(db){
			return db.connection;
		}
		return null;
	}

	/**
	 * getDb()
	 * 获取数据库对象
	 * ------------
	 * @return
	 * @author Verdient。
	 */
	getDb(){
		return this.constructor.getDb();
	}

	/**
	 * find()
	 * 查找
	 * ------
	 * @author Verdient。
	 */
	static find(){
		return new ActiveQuery({class: this});
	}

	/**
	 * find()
	 * 查找
	 * ------
	 * @author Verdient。
	 */
	find(){
		return this.constructor.find();
	}

	/**
	 * @getter primaryKey()
	 * 获取主键
	 * --------------------
	 * @return {String}
	 * @author Verdient。
	 */
	get primaryKey(){
		throw new InvalidMethodError('primaryKey method must be overridden by subclasses');
	}

	/**
	 * populate(Object data)
	 * 数据落入模型
	 * ---------------------
	 * @param {Object} data 数据
	 * -------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	populate(data){
		super.populate(data);
		this._isNewRecord = false;
		return this;
	}

	/**
	 * save(Boolean runValidation)
	 * 保存
	 * ---------------------------
	 * @param {Boolean} runValidation 是否运行校验
	 * -----------------------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	save(runValidation){
		if(runValidation !== false){
			runValidation = true;
		}
		return this.isNewRecord ? this.insert(runValidation) : this.update(runValidation);
	}

	/**
	 * insert(Boolean runValidation)
	 * 插入记录
	 * -----------------------------
	 * @param {Boolean} runValidation 是否运行校验
	 * -----------------------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	insert(runValidation){
		if(runValidation !== false){
			runValidation = true;
		}
		return new Promise((resolve, revoke) => {
			if(runValidation){
				this.validate().then(() => {
					this._insertInternal().then(resolve).catch(revoke);
				}).catch(revoke);
			}else{
				this._insertInternal().then(resolve).catch(revoke);
			}
		});
	}

	/**
	 * _insertInternal()
	 * 插入
	 * -----------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	_insertInternal(){
		return new Promise((resolve, revoke) => {
			this._attributes['created_at'] = this._attributes['updated_at'] = Date.now();
			let attribures = Object.keys(this._attributes);
			let values = [];
			attribures.forEach(attribure => {
				values.push(this._attributes[attribure]);
			});
			let sql = Command.buildInsert(this.tableName(), attribures, values);
			this.trace(sql, 'INSERT SQL');
			let db = this.getDb();
			setTimeout(() => {
				db.query(sql).then(result => {
					if(Array.isArray(this.primaryKey) && this.primaryKey[0] && Array.isArray(result) && result[0]){
						this._attributes[this.primaryKey[0]] = result[0].insertId;
					}
					resolve(result);
				}).catch(revoke);
			});
		});
	}

	/**
	 * update(Boolean runValidation)
	 * 更新记录
	 * -----------------------------
	 * @param {Boolean} runValidation 是否运行校验
	 * -----------------------------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	update(runValidation){
		if(runValidation !== false){
			runValidation = true;
		}
		return new Promise((resolve, revoke) => {
			if(runValidation){
				this.validate().then(() => {
					this._updateInternal().then(resolve).catch(revoke);
				}).catch(revoke);
			}else{
				this._updateInternal().then(resolve).catch(revoke);
			}
		});
	}

	/**
	 * _updateInternal()
	 * 更新
	 * -----------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	_updateInternal(){
		return new Promise((resolve, revoke) => {
			let dirtyValues = this.dirtyValues;
			if(objectHelper.isEmptyObject(dirtyValues)){
				resolve(0);
			}else{
				dirtyValues['updated_at'] = Date.now();
				let where = {};
				this.primaryKey.forEach(attribure => {
					where[attribure] = this._oldAttributes[attribure];
				});
				let sql = Command.buildUpdate(this.tableName(), this.dirtyValues, ActiveQuery.formatWhere(where));
				this.trace(sql, 'UPDATE SQL');
				let db = this.getDb();
				setTimeout(() => {
					db.query(sql).then(result => {
						this._oldAttributes = JSON.parse(JSON.stringify(this._attributes));
						resolve(result);
					}).catch(revoke);
				});
			}
		});
	}
}

module.exports = ActiveRecord;