'use strict'

const Component = require('../base/Component');
const Instance = require('../di/Instance');

/**
 * API
 * 接口组件
 * -------
 * @author Verdient。
 */
class API extends Component
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
		this.port = null;

		/**
		 * @property protocol
		 * 协议
		 * ------------------
		 * @author Verdient。
		 */
		this.protocol = 'http';

		/**
		 * @property cUrl
		 * CUrl组件
		 * --------------
		 * @author Verdient。
		 */
		this.cUrl = 'cUrl';

		/**
		 * @property prefix
		 * 前缀
		 * ----------------
		 * @author Verdient。
		 */
		this._prefix = this.protocol + '://' + this.host;

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
		this._prefix = this.protocol + '://' + this.host;
		if(this.port){
			if(!((this.protocol === 'http' && this.port == 80) || (this.protocol === 'https' && this.port == 443))){
				this._prefix += ':' + this.port;
			}
		}
		this.cUrl = Instance.ensure(this.cUrl);
		this._prefix += '/';
		return this;
	}

	/**
	 * @getter prefix()
	 * 获取前缀
	 * ----------------
	 * @author Verdient。
	 */
	get prefix(){
		return this._prefix;
	}

	/**
	 * @getter cUrlInstance()
	 * 获取CUrl实例
	 * ----------------------
	 * @return {CUrl}
	 * @author Verdient。
	 */
	get cUrlInstance(){
		return this.cUrl.instance;
	}
}

module.exports = API;