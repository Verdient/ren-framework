'use strict'

const Component = require('../base/Component');
const Instance = require('../di/Instance');
const asyncHelper = require('../helpers/async');
const randomHelper = require('../helpers/random');

/**
 * 池
 * @author Verdient。
 */
class Pool extends Component
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property Redis组件
		 * @author Verdient。
		 */
		this.redis = 'redis';

		/**
		 * @property 前缀
		 * @author Verdient。
		 */
		this.prefix = 'pool_for_';

		/**
		 * @property 移除过期元素时间间隔
		 * @author Verdient。
		 */
		this.removeExpiredInterval = 100;

		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		super.init();
		this.redis = Instance.ensure(this.redis).client;

		/**
		 * 移除过期的元素
		 * @author Verdient。
		 */
		let removeExpired = () => {
			this.redis.keys(this.prefix + '*', (error, members) => {
				if(error){
					this.error(error);
					setTimeout(() => {
						removeExpired();
					}, this.removeExpiredInterval);
				}else{
					asyncHelper.each(members, (value, index, callback) => {
						this.redis.zremrangebyscore(value, 1, Date.now(), callback);
					}).then(() => {
						setTimeout(() => {
							removeExpired();
						}, this.removeExpiredInterval);
					}).catch(error => {
						this.error(error);
						setTimeout(() => {
							removeExpired();
						}, this.removeExpiredInterval);
					});
				}
			});
		}

		removeExpired();

		return this;
	}

	/**
	 * 加入池
	 * @param {String} name 名称
	 * @param {Mixed} value 内容
	 * @param {Integer} expires 过期时间
	 * @return {Promise}
	 * @author Verdient。
	 */
	add(name, value, expires){
		value = {value};
		name = this.prefix + name;
		return new Promise((resolve, revoke) => {
			setTimeout(() => {
				let expiresAt = expires > 0 ? (Date.now() + expires) : 0;
				this.redis.zadd(name, expiresAt, JSON.stringify(value), (error) => {
					if(error){
						revoke(error);
					}else{
						resolve();
					}
				});
			});
		});
	}

	/**
	 * 获取
	 * @param {String} name 名称
	 * @return {Mixed}
	 * @author Verdient。
	 */
	get(name){
		name = this.prefix + name;
		return new Promise((resolve, revoke) => {
			setTimeout(() => {
				this.redis.zrange(name, 0, -1, (error, members) => {
					if(error){
						revoke(error);
					}else{
						if(members.length > 0){
							let index = randomHelper.number(0, members.length - 1);
							let value = JSON.parse(members[index]);
							resolve(value.value);
						}else{
							resolve(null);
						}
					}
				});
			});
		});
	}

	/**
	 * 删除
	 * @param {String} name 名称
	 * @param {Mixed} value 内容
	 * @return {Self}
	 * @author Verdient。
	 */
	delete(name, value){
		name = this.prefix + name;
		value = {value};
		return new Promise((resolve, revoke) => {
			setTimeout(() => {
				this.redis.zrem(name, JSON.stringify(value), (error) => {
					if(error){
						revoke(error);
					}else{
						resolve();
					}
				});
			});
		});
	}

	/**
	 * 获取池的大小
	 * @param {String} name 名称
	 * @return {Integer}
	 * @author Verdient。
	 */
	size(name){
		name = this.prefix + name;
		return new Promise((resolve, revoke) => {
			this.redis.zcard(name, (error, size) => {
				if(error){
					revoke(error);
				}else{
					resolve(size);
				}
			});
		});
	}

	/**
	 * 刷新
	 * @param {String} name 名称
	 * @return {Promise}
	 * @author Verdient。
	 */
	flush(name){
		name = this.prefix + name;
		return new Promise((resolve, revoke) => {
			this.redis.del(name, (error) => {
				if(error){
					revoke(error);
				}else{
					resolve();
				}
			});
		});
	}
}

module.exports = Pool;