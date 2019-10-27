'use strict'

const Base = require('../base/Base');
const Components = require('../base/Components');
const coreConfig = require('../base/config');
const objectHelper = require('../helpers/object');
const Console = require('./Console');

/**
 * Application
 * 应用
 * -----------
 * @author Verdient。
 */
class Application extends Base
{
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
		this.config = objectHelper.merge(coreConfig, this.options);
		this._commands = [];
		this._commandsMap = {};
		Components.register(this.config.components);
		if(objectHelper.type(this.config.consoles) == 'object' && !objectHelper.isEmptyObject(this.config.consoles)){
			let commands = [];
			for(let i in this.config.consoles){
				commands.push(i);
			}
			this.setCommands(commands);
			this.setCommandMap(this.config.consoles);
		}
		return this;
	}

	/**
	 * setCommands(Array commands)
	 * 设置命令
	 * ---------------------------
	 * @param {Array} commands 命令
	 * ---------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	setCommands(commands){
		if(Array.isArray(commands)){
			this._commands = commands;
		}else{
			throw new Error('Console commands must be an array');
		}
		return this;
	}

	/**
	 * setCommandMap(Object commandMap)
	 * 设置命令映射
	 * --------------------------------
	 * @param {Object} commandMap 命令映射
	 * ----------------------------------
	 * @return {Self}
	 * @author Verdient。
	 */
	setCommandMap(commandMap){
		if(objectHelper.isPlainObject(commandMap)){
			this._commandsMap = commandMap;
		}else{
			throw new Error('Console commandMap must be an object');
		}
		return this;
	}

	/**
	 * help()
	 * 帮助信息
	 * -------
	 * @author Verdient。
	 */
	help(){
		let commandsString = '';

		this._commands.forEach(value => {
			commandsString += '    ' + value + '\n'
		})

		console.info('\n' +
			'Usage: node bin/console <command>' +
			'\n\n' +
			'where <command> is one of:\n' + commandsString
		)
	}

	/**
	 * run()
	 * 运行
	 * -----
	 * @author Verdient。
	 */
	run(){
		let commands = Console.commands();
		let command = commands[0];
		if(!command){
			this.help();
			process.exit();
		}else{
			if(!objectHelper.inArray(command, this._commands)){
				Console.info('Unknown Command');
				this.help();
				process.exit();
			}else{
				require(this._commandsMap[command])();
			}
		}
	}
}

module.exports = Application;