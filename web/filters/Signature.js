const AuthenticationError = require('../errors/AuthenticationError');
const Signature = require('../../components/Signature');
const Filter = require('../Filter');

/**
 * SignatureFilter
 * 签名过滤器
 * ---------------
 * @author Verdient。
 */
class SignatureFilter extends Filter
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
		 * @var headerName
		 * 头部名称
		 * ---------------
		 * @author Verdient。
		 */
		this.headerName = 'Signature';

		/**
		 * signatureMethodHeader
		 * 签名方法头部名称
		 * ---------------------
		 * @author Verdient。
		 */
		this.signatureMethodHeader = 'Signature-Method';

		/**
		 * @var key
		 * 签名秘钥
		 * --------
		 * @author Verdient。
		 */
		this.key = '';

		/**
		 * @var message
		 * 提示信息
		 * -------------
		 * @author Verdient。
		 */
		this.message = 'Your request was made with invalid credentials.';

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
			let signature = new Signature({key: this.key});
			let requestSignature = request.getHeader(this.headerName);
			if(!requestSignature){
				revoke(new AuthenticationError(this.message));
			}else{
				var signatureString = signature.signature(request.body, request.getHeader(this.signatureMethodHeader));
				if(signatureString != requestSignature){
					revoke(new AuthenticationError(this.message));
				}else{
					resolve();
				}
			}
		});
	}
}

module.exports = SignatureFilter
