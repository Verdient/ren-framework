'use strict'

const cliColor = require('cli-color');
const LoggerTarget = require('./LoggerTarget');
const DateHelper = require('../../../helpers/date');

/**
 * ConsoleTarget
 * 打印目标
 * -------------
 * @author Verdient。
 */
class ConsoleTarget extends LoggerTarget
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
		 * @property levelMap
		 * 等级映射
		 * ------------------
		 * @author Verdient。
		 */
		this.levelMap = new Map();
		this.levelMap.set('trace', {logger: console.log, color: 'bgGreenBright'});
		this.levelMap.set('info', {logger: console.info, color: 'bgBlueBright'});
		this.levelMap.set('warning', {logger: console.warn, color: 'bgYellowBright'});
		this.levelMap.set('error', {logger: console.error, color: 'bgRedBright'});

		return this;
	}

	/**
	 * log(String level, Mixed data, String category)
	 * 记录日志
	 * ----------------------------------------------
	 * @param {String} level 等级
	 * @param {Mixed} data 数据
	 * @param {String} category 分类
	 * -----------------------------
	 * @inheritdoc
	 * -----------
	 * @author Verdient。
	 */
	log(level, data, category){
		let getStackTrace = () => {
			let obj = {};
			Error.captureStackTrace(obj, getStackTrace);
			return obj.stack;
		};
		if(this.levelEnabled(level) && this.categoryEnabled(category)){
			let stack = getStackTrace() || '';
			if(!category){
				let matchResult = stack.match(/\(.*?\)/g) || [];
				let line = matchResult[3] || '';
				category = line.replace('(', '').replace(')', '').replace(process.cwd() + '/', '');
			}
			let options = this.levelMap.get(level);
			let logger = options.logger;
			let color = options.color;
			process.stdout.write(
				cliColor.bgMagenta(DateHelper.time2str('yyyy-MM-dd hh:mm:ss', Date.now())) +
				' ' + cliColor[color]('[' + level + ']') + ' ' +
				cliColor.bgRed('[' + category + ']') + ' '
			);
			logger(data);
			if(level === 'error'){
				stack = stack.split('at ') || [];
				if(stack.length > 4){
					stack.splice(0, 1);
					stack.splice(0, 1);
					stack.splice(0, 1);
					stack.splice(0, 1);
					stack[0] = '    at ' + stack[0];
					logger(cliColor.bgRed(stack.join('at ')));
				}
			}
		}
	}
}

module.exports = ConsoleTarget;