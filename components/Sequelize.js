'use strict'

const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const Component = require('../base/Component');

/**
 * Sequelize
 * sequelize
 * ---------
 * @author Verdient。
 */
class Sequelize extends Component
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
		 * @var datebase
		 * 数据库名称
		 * -------------
		 * @author Verdient。
		 */
		this.datebase = '';

		/**
		 * @var username
		 * 用户名
		 * -------------
		 * @author Verdient。
		 */
		this.username = '';

		/**
		 * @var password
		 * 密码
		 * -------------
		 * @author Verdient。
		 */
		this.password = '';

		/**
		 * @var host
		 * 主机地址
		 * ---------
		 * @author Verdient。
		 */
		this.host = '127.0.0.1';

		/**
		 * @var port
		 * 端口
		 * ---------
		 * @author Verdient。
		 */
		this.port = 3306;

		/**
		 * @var dialect
		 * 数据库类型
		 * ------------
		 * @author Verdient。
		 */
		this.dialect = 'mysql';

		/**
		 * @var freezeTableName
		 * 是否不改变表名
		 * --------------------
		 * @author Verdient。
		 */
		this.freezeTableName = true;

		/**
		 * @var underscored
		 * 多词是否使用下划线
		 * -----------------
		 * @author Verdient。
		 */
		this.underscored = true;

		/**
		 * @var logging
		 * 是否打印日志
		 * ------------
		 * @author Verdient。
		 */
		this.logging = false;

		/**
		 * @var timezone
		 * 时区
		 * -------------
		 * @author Verdient。
		 */
		this.timezone = '+08:00';

		/**
		 * @var operatorsAliases
		 * 是否启用操作符别名
		 * ---------------------
		 * @author Verdient。
		 */
		this.operatorsAliases = false;

		/**
		 * modelsPath
		 * 模型路径
		 * ----------
		 * @author Verdient。
		 */
		this.modelsPath = 'models';

		return this;
	}

	/**
	 * init()
	 * 初始化
	 * -----
	 * @author Verdient。
	 */
	init(){
		super.init();

		let component = new sequelize(this.datebase, this.username, this.password, {
			host: this.host,
			port: this.port,
			dialect: this.dialect,
			pool: {
				max: 10,
				min: 3,
				acquire: 30000,
				idle: 10000
			},
			define: {
				freezeTableName: this.freezeTableName,
				underscored: this.underscored,
			},
			timezone: this.timezone,
			logging: this.logging,
			operatorsAliases: this.operatorsAliases
		});
		try{
			let realPath = fs.realpathSync(this.modelsPath);
			let models = fs.readdirSync(this.modelsPath);
			models.forEach((file) => {
				component.import(path.join(realPath, file));
			});
		}catch(error){}

		return component;
	}
}

module.exports = Sequelize;