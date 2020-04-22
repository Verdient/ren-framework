'use strict'

const Component = require('../base/Component');
const Instance = require('../di/Instance');

/**
 * 接口组件
 * @author Verdient。
 */
class API extends Component
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
		this.port = null;

		/**
		 * @property 协议
		 * @author Verdient。
		 */
		this.protocol = 'http';

		/**
		 * @property CUrl组件
		 * @author Verdient。
		 */
		this.cUrl = 'cUrl';

		/**
		 * @property 前缀
		 * @author Verdient。
		 */
		this._prefix = this.protocol + '://' + this.host;

		return this;
	}

	/**
	 * @inheritdoc
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
	 * 获取前缀
	 * @getter prefix
	 * @author Verdient。
	 */
	get prefix(){
		return this._prefix;
	}

	/**
	 * 获取CUrl实例
	 * @getter cUrlInstance
	 * @return {CUrl}
	 * @author Verdient。
	 */
	get cUrlInstance(){
		return this.cUrl.instance;
	}
}

module.exports = API;