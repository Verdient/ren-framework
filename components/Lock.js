'use strict'

const uuidV1 = require('uuid/v1');
const Component = require('../base/Component');
const Instance = require('../di/Instance');
const InvalidParamError = require('../errors/InvalidParamError');

/**
 * Lock
 * 锁
 * ----
 * @author Verdient。
 */
class Lock extends Component
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
		 * @property duration
		 * 生存周期
		 * ------------------
		 * @author Verdient。
		 */
		this.duration = 60000;

		/**
		 * @property redis
		 * redis组件
		 * ---------------
		 * @author Verdient。
		 */
		this.redis = 'redis';

		/**
		 * @property prefix
		 * 前缀
		 * ----------------
		 * @author Verdient。
		 */
		this.prefix = 'lock_for_';

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
		this.redis = Instance.ensure(this.redis).client;
		return this;
	}

	/**
	 * lock(String name, Integer expires)
	 * 上锁
	 * ---------------------------------
	 * @param {String} name 锁名称
	 * @param {Integer} expires 过期时间
	 * --------------------------------
	 * @author fzm_csb
	 */
	lock(name, expires){
		return new Promise((resolve, revoke) => {
			let lockName = this.prefix + name;
			if(!name){
				return revoke(new InvalidParamError('name must be set'));
			}
			expires = parseInt(expires || this.duration);
			let key = uuidV1();
			this.redis.set(lockName, key, 'PX', expires, 'NX', (error, status) => {
				if(error){
					revoke(error);
				}else if(status){
					resolve({
						name,
						key,
						expires_at: expires + Date.now()
					});
				}else{
					revoke(name + ' has been locked');
				}
			});
		});
	}

	/**
	 * release(String name, String key)
	 * 释放锁
	 * --------------------------------
	 * @param {String} name 锁名称
	 * @param {String} key 锁钥匙
	 * --------------------------
	 * @author Verdient。
	 */
	release(name, key){
		return new Promise((resolve, revoke) => {
			let lockName = this.prefix + name;
			if(!name){
				return revoke(new InvalidParamError('name must be set'));
			}
			this.redis.get(lockName, (error, result) => {
				if(error){
					revoke(error);
				}else if(result === key){
					this.redis.del(lockName, (error) => {
						if(error){
							revoke(error);
						}else{
							resolve();
						}
					});
				}else{
					revoke('key do not match');
				}
			});
		});
	}
}

module.exports = Lock;