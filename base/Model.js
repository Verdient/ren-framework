'use strict'

const Component = require('./Component');
const FatalError = require('../errors/FatalError');
const Validators = require('./Validators');
const objectHelper = require('../helpers/object');
const asyncHelper = require('../helpers/async');

/**
 * 基本模型
 * @author Verdient。
 */
class Model extends Component
{
	/**
	 * @inheritdoc
	 * @return {Proxy}
	 * @author Verdient。
	 */
	constructor(){
		super();
		return new Proxy(this, {
			get: (target, key) => {
				if(key in target){
					return target[key];
				}
				return target._attributes[key];
			},
			set: (target, key, value) => {
				if(key in target){
					target[key] = value;
				}else{
					target._attributes[key] = value;
				}
				return target;
			}
		});
	}

	/**
	 * @inheritdoc
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @property 属性
		 * @author Verdient。
		 */
		this._attributes = {};

		/**
		 * @property 原来的属性
		 * @author Verdient。
		 */
		this._oldAttributes = {};

		/**
		 * @property 场景
		 * @author Verdient。
		 */
		this.scenario = null;

		/**
		 * @property 场景规则
		 * @author Verdient。
		 */
		this._scenarioRules = {};

		return this;
	}

	/**
	 * 获取场景规则
	 * @return {Array}
	 * @author Verdient。
	 */
	get scenarioRules(){
		if(!this._scenarioRules[this.scenario]){
			let rules = this.rules();
			let scenarioRules = {};
			for(var i in rules){
				rules[i].forEach(rule => {
					if(!rule.on){
						if(!scenarioRules[i]){
							scenarioRules[i] = [];
						}
						scenarioRules[i].push(rule);
					}else{
						if(objectHelper.inArray(this.scenario, rule.on)){
							delete rule.on;
							if(!scenarioRules[i]){
								scenarioRules[i] = [];
							}
							scenarioRules[i].push(rule);
						}
					}
				});
			}
			this._scenarioRules[this.scenario] = scenarioRules;
		}
		return this._scenarioRules[this.scenario];
	}

	/**
	 * 活跃的属性
	 * @return {Array}
	 * @auhtor Verdient。
	 */
	get activeAttributes(){
		return Object.keys(this.scenarioRules);
	}

	/**
	 * 规则集合
	 * @return {Object}
	 * @author Verdient。
	 */
	rules(){
		return {};
	}

	/**
	 * 载入数据
	 * @param {Object} data 数据
	 * @return {Model}
	 * @author Verdient。
	 */
	load(data){
		this.activeAttributes.forEach(attribute => {
			if(typeof data[attribute] !== 'undefined'){
				this._attributes[attribute] = data[attribute];
			}
		});
		return this;
	}

	/**
	 * 数据填入模型
	 * @param {Object} data 数据
	 * @return {Model}
	 * @author Verdient。
	 */
	populate(data){
		for(let name in data){
			this._attributes[name] = data[name];
			this._oldAttributes[name] = data[name];
		}
		return this;
	}

	/**
	 * 校验
	 * @return {Promise}
	 * @author Verdient。
	 */
	validate(){
		return new Promise((resolve, revoke) => {
			setTimeout(() => {
				let scenarioRules = this.scenarioRules;
				let rules = [];
				for(let attribute in scenarioRules){
					for(var rule of scenarioRules[attribute]){
						rules.push({
							attribute,
							rule
						});
					}
				}
				asyncHelper.eachSeries(rules, (rule, index, callback) => {
					let type = rule.rule.type;
					let attribute = rule.attribute;
					delete rule.rule.type;
					let validator = Validators.getValidator(type, rule.rule);
					if(!validator){
						let error = new FatalError('Unsupported validate type: ' + type);
						this.addError(attribute, error);
						callback(error);
					}else{
						validator.validateAttribute(this, attribute).then(callback).catch(callback);
					}
				}).then(() => {
					resolve(this);
				}).catch(error => {
					revoke(error);
				});
			});
		});
	}

	/**
	 * 获取属性
	 * @getter attributes
	 * @return {Object}
	 * @author Verdient。
	 */
	get attributes(){
		return this._attributes;
	}

	/**
	 * 获取原来的属性
	 * @getter oldAttributes
	 * @return {Object}
	 * @author Verdient。
	 */
	get oldAttributes(){
		return this._oldAttributes;
	}

	/**
	 * 获取变化的属性
	 * @getter dirtyAttributes
	 * @return {Array}
	 * @author Verdient。
	 */
	get dirtyAttributes(){
		let dirtyAttributes = [];
		for(let name in this._oldAttributes){
			if(this._attributes[name] !== this._oldAttributes[name]){
				dirtyAttributes.push(name);
			}
		}
		return dirtyAttributes;
	}

	/**
	 * 获取变化的值
	 * @getter dirtyValues
	 * @return {Object}
	 * @author Verdient。
	 */
	get dirtyValues(){
		let values = {};
		this.dirtyAttributes.forEach(attribute => {
			values[attribute] = this._attributes[attribute];
		});
		return values;
	}
}

module.exports = Model;