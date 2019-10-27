'use strict'

const fs = require('fs');
const Component = require('../../base/Component');

/**
 * Translation
 * 翻译
 * -----------
 * @author Verdient。
 */
class Translation extends Component
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
		 * @var language
		 * 语言
		 * -------------
		 * @author Verdient。
		 */
		this.language = 'en-US';

		/**
		 * @var messagePath
		 * 语言文件路径
		 * ----------------
		 * @author Verdient。
		 */
		this.messagePath = 'message';

		/**
		 * @var _maps
		 * 语言映射
		 * ----------
		 * @author Verdient。
		 */
		this._maps = {};

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
		this.register();
		return this;
	}

	/**
	 * register()
	 * 注册
	 * ----------
	 * @author Verdient。
	 */
	register(){
		try{
			let languages = [];
			languages = fs.readdirSync(this.messagePath);
			languages.forEach(language => {
				if(typeof this._maps[language] == 'undefined'){
					this._maps[language] = {};
				}
				let files = fs.readdirSync(this.messagePath + '/' + language);
				files.forEach(file => {
					this._maps[language][file.replace('.js', '')] = require(fs.realpathSync(this.messagePath + '/' + language + '/' + file));
				});
			});
		}catch(error){
			this.error(error);
		}
	}

	/**
	 * getMap(String type, String language)
	 * 获取映射
	 * ------------------------------------
	 * @param {String} type 类型
	 * @param {String} language 语言
	 * ----------------------------
	 * @author Verdient。
	 */
	getMap(type, language){
		return typeof this._maps[language] == 'object' && typeof this._maps[language][type] == 'object' ? this._maps[language][type] : false;
	}

	/**
	 * format(String type, String value, Object params, String language)
	 * 格式化
	 * -----------------------------------------------------------------
	 * @param {String} type 类型
	 * @param {String} value 待格式化的值
	 * @param {String} params 参数
	 * @param {String} language 语言
	 * ---------------------------------
	 * @return {String}
	 * @author Verdient。
	 */
	format(type, value, params, language){
		if(!language){
			language = this.language;
		}
		let map = this.getMap(type, language);
		if(map && map[value]){
			value = map[value];
		}
		for(let name in params){
			value = value.replace('{' + name + '}', params[name]);
		}
		return value;
	}
}

module.exports = Translation;