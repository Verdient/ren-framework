'use strict'

const Component = require('../base/Component');

/**
 * Connection
 * 连接
 * ----------
 * @author Verdient。
 */
class Connection extends Component
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
		this.host = '127.0.0.1';
		this.port = null;
		this._connection = null;
		return this;
	}

	/**
	 * @getter connection()
	 * 获取连接对象
	 * ---------------------
	 * @author Verdient。
	 */
	get connection(){
		return this._connection;
	}
}

module.exports = Connection;