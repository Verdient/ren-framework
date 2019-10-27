'use strict'

const mysql = require('mysql2');
const BaseConnection = require('../Connection');

/**
 * Connection
 * 连接
 * ----------
 * @author Verdient。
 */
class Connection extends BaseConnection
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
		 * @property port
		 * 端口
		 * --------------
		 * @author Verdient。
		 */
		this.port = 3306;

		/**
		 * @property username
		 * 用户名
		 * ------------------
		 * @author Verdient。
		 */
		this.username = 'root';

		/**
		 * @property password
		 * 密码
		 * ------------------
		 * @author Verdient。
		 */
		this.password = null;

		/**
		 * @property database
		 * 数据库名称
		 * ------------------
		 * @author Verdient。
		 */
		this.database = null;

		/**
		 * @var waitForConnections
		 * 是否等待连接
		 * -----------------------
		 * @author Verdient。
		 */
		this.waitForConnections = false;

		/**
		 * @var connectionLimit
		 * 最大连接数
		 * --------------------
		 * @author Verdient。
		 */
		this.connectionLimit = 50;

		/**
		 * queueLimit
		 * 队列最大数量
		 * ----------
		 * @author Verdient。
		 */
		this.queueLimit = 50;

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
		this._connection = this.connect({
			host: this.host,
			port: this.port,
			user: this.username,
			password: this.password,
			database: this.database,
			connectTimeout: 20000,
			waitForConnections: this.waitForConnections,
			connectionLimit: this.connectionLimit,
			queueLimit: this.queueLimit
		});
		return this;
	}

	/**
	 * connect(Object options)
	 * 连接
	 * -----------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @return {Connection}
	 * @author Verdient。
	 */
	connect(options){
		return mysql.createPool(options);
	}

	/**
	 * @getter connection()
	 * 获取连接对象
	 * ---------------------
	 * @return {Promise}
	 * @author Verdient。
	 */
	get connection(){
		return this._connection.promise();
	}
}

module.exports = Connection;