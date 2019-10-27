'use strict';

const redis = require('redis');

const Component = require('../base/Component');

/**
 * Redis
 * Redis 缓存
 * ---------
 * @author Verdient。
 */
class Redis extends Component
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
		 * @property host
		 * 主机
		 * --------------
		 * @author Verdient。
		 */
		this.host = '127.0.0.1';

		/**
		 * @property port
		 * 端口
		 * --------------
		 * @author Verdient。
		 */
		this.port = 6379;

		/**
		 * @property password
		 * 密码
		 * ------------------
		 * @author Verdient。
		 */
		this.password = null;

		/**
		 * @property db
		 * 数据库
		 * ------------
		 * @author Verdient。
		 */
		this.db = 0;

		/**
		 * @property _client
		 * 客户端
		 * -----------------
		 * @author Verdient。
		 */
		this._client = null;

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
		this._client = redis.createClient({
			host: this.host,
			port: this.port,
			password: this.password,
			db: this.db
		});
	}

	/**
	 * @getter client()
	 * 获取客户端
	 * ----------------
	 * @return {Redis}
	 * @author Verdient。
	 */
	get client(){
		return this._client;
	}
}

module.exports = Redis;