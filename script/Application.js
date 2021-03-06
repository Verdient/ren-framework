'use strict'

const Base = require('../base/Base');
const Components = require('../base/Components');
const Console = require('../console/Console');
const coreConfig = require('../base/config');
const objectHelper = require('../helpers/object');

/**
 * 应用
 * @author Verdient。
 */
class Application extends Base
{
	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();
		this.scripts = {};
		return this;
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	init(){
		super.init();
		this.config = objectHelper.merge(coreConfig, this.options);
		this.components = Components.register(this.config.components);
		return this;
	}

	/**
	 * 运行
	 * @author Verdient。
	 */
	run(){
		const logger = Components.getComponent('logger');
		let commands = Console.commands();
		if(commands.length === 0){
			if(!objectHelper.isEmptyObject(this.scripts)){
				for(let i in this.scripts){
					if(this.scripts[i]){
						if(typeof this.scripts[i] == 'string'){
							let Script = require(this.scripts[i]);
							new Script({
								components: this.components
							}).run();
							logger.info(i + ' job started', 'Application');
						}else if(typeof this.scripts[i] == 'object'){
							if(typeof this.scripts[i].module == 'undefined'){
								throw new Error('Scripts module must be set');
							}
							let Script = require(this.scripts[i].module);
							new Script(objectHelper.merge(this.scripts[i], {
								components: this.components
							})).run();
							logger.info(i + ' job started', 'Application');
						}else{
							throw new Error('Please check you config.');
						}
					}
				}
			}else{
				logger.warning('no scripts', 'Application');
				process.exit();
			}
		}else{
			commands = Array.from(new Set(commands));
			commands.forEach(script => {
				if(!this.scripts[script]){
					logger.error('Script ' + script + ' is undefined.', 'Application');
					process.exit();
				}
			});
			commands.forEach(scriptName => {
				if(typeof this.scripts[scriptName] == 'string'){
					let script = require(this.scripts[scriptName])();
					if(typeof script.init == 'function'){
						script.init();
					}
					logger.info(scriptName + ' job started', 'Application');
				}else if(typeof this.scripts[scriptName] == 'object'){
					if(typeof this.scripts[scriptName].module == 'undefined'){
						throw new Error('Scripts module must be set');
					}
					let script = require(this.scripts[scriptName].module)();
					for(let m in this.scripts[scriptName]){
						if(m != 'module'){
							script[m] = this.scripts[scriptName][m];
						}
					}
					if(typeof script.init == 'function'){
						script.init();
					}
					logger.info(scriptName + ' job started', 'Application');
				}else{
					throw new Error('Please check you config.');
				}
			});
		}
	}
}

module.exports = Application;