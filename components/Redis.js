'use strict';

const redis = require('redis');

const Component = require('../base/Component');

/**
 * Redis组件
 * @author Verdient。
 */
class Redis extends Component
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 主机
		 * @author Verdient。
		 */
		this.host = '127.0.0.1';

		/**
		 * @property 端口
		 * @author Verdient。
		 */
		this.port = 6379;

		/**
		 * @property 密码
		 * @author Verdient。
		 */
		this.password = null;

		/**
		 * @property 数据库
		 * @author Verdient。
		 */
		this.db = 0;

		/**
		 * @property 客户端
		 * @author Verdient。
		 */
		this._client = null;

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		super.init();
		this._client = redis.createClient({
			host: this.host,
			port: this.port,
			password: this.password,
			db: this.db
		});
	}

	/**
	 * 获取客户端
	 * @getter client
	 * @return {Redis}
	 * @author Verdient。
	 */
	get client(){
		return this._client;
	}
}

module.exports = Redis;