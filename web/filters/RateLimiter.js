'use strict'

const Filter = require('../Filter');
const TooManyRequestsError = require('../errors/TooManyRequestsError');

/**
 * RateLimiter
 * 速率限制器
 * -----------
 * @author Verdient。
 */
class RateLimiter extends Filter
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
		 * @var _count
		 * 请求总数
		 * -----------
		 * @author Verdient。
		 */
		this._count = 0;

		/**
		 * @var _period
		 * 周期
		 * ------------
		 * @author Verdient。
		 */
		this._period = 0;

		/**
		 * @var precision
		 * 精度
		 * --------------
		 * @author Verdient。
		 */
		this.precision = 1000;

		/**
		 * @var max
		 * 最大数量
		 * --------
		 * @author Verdient。
		 */
		this.max = 100;

		/**
		 * @var message
		 * 提示信息
		 * -------------
		 * @author Verdient。
		 */
		this.message = 'Rate limit exceeded.';

		return this;
	}

	/**
	 * filter(Request request, Response response)
	 * 过滤
	 * ------------------------------------------
	 * @param {Request} request 请求
	 * @param {Response} response 响应
	 * ------------------------------
	 * @inheritdoc
	 * -----------
	 * @return {Promise}
	 * @author Verdient。
	 */
	filter(request, response){
		return new Promise((resolve, revoke) => {
			let now = Math.floor(Date.now() / this.precision);
			if(this._period != now){
				this._count = 0;
			}
			this._period = now;
			this._count ++;
			if(this._count > this.max){
				revoke(new TooManyRequestsError(this.message));
			}else{
				resolve();
			}
		});
	}
}

module.exports = RateLimiter;