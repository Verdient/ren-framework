'use strict'

const cliColor = require('cli-color');
const LoggerTarget = require('./LoggerTarget');
const DateHelper = require('../../../helpers/date');

/**
 * 打印目标
 * @author Verdient。
 */
class ConsoleTarget extends LoggerTarget
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @var {Map} 等级映射
		 * @author Verdient。
		 */
		this.levelMap = new Map();
		this.levelMap.set('trace', {logger: console.log, color: 'greenBright'});
		this.levelMap.set('info', {logger: console.info, color: 'blueBright'});
		this.levelMap.set('warning', {logger: console.warn, color: 'yellowBright'});
		this.levelMap.set('error', {logger: console.error, color: 'redBright'});

		return this;
	}

	/**
	 * @inheritdoc
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
				DateHelper.time2str('yyyy-MM-dd hh:mm:ss', Date.now()) +
				' ' + cliColor[color]('[' + level + ']') + ' ' +
				cliColor.red('[' + category + ']') + ' '
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