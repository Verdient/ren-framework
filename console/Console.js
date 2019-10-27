'use strict'

const readline = require('readline');
const cliColor = require('cli-color');
const Class = require('../base/Class');

/**
 * Console
 * 命令行
 * -------
 * @author Verdient。
 */
class Console extends Class
{
	/**
	 * commands()
	 * 获取参数
	 * ----------
	 * @return {Array}
	 * @author Verdient。
	 */
	static commands(){
		return process.argv.splice(2);
	}

	/**
	 * question(String tip, Object options, Callable callback)
	 * 询问
	 * -------------------------------------------------------
	 * @param {String} tip 提示
	 * @param {Object} options 参数
	 * @param {Callable} callback 回调函数
	 * ----------------------------------
	 * @author Verdient。
	 */
	static question(tip, options, callback){
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		let defaultOptions = {
			default: '',
			required: true
		}
		if(typeof options == 'function'){
			callback = options;
			options = defaultOptions;
		}
		options = objectHelper.merge(defaultOptions, options);
		rl.question(tip, (answer) => {
			rl.close();
			if(answer === ''){
				if(options.default !== ''){
					return callback(answer);
				}else if(options.required === true){
					return Console.question(tip, options, callback);
				}
			}
			return callback(answer);
		});
	}

	/**
	 * info(String message)
	 * 提示信息
	 * --------------------
	 * @param {String} message 提示信息
	 * -------------------------------
	 * @author Verdient。
	 */
	static info(message){
		if(typeof message == 'string' || typeof message == 'number'){
			let length = message.length + 37;
			if(message.match(/[\u4E00-\u9FA5]/g)){
				length += message.match(/[\u4E00-\u9FA5]/g).length;
			}
			let cuttingline = new Array(length).join('-');
			console.info('\n  ' + cuttingline + '\n［                  ' + message + '                  ]\n  ' + cuttingline);
		}else{
			console.info(message);
		}
	}

	/**
	 * table(Object/Array data)
	 * 提示信息
	 * ------------------------
	 * @param {Object/Array} data 数据
	 * ------------------------------
	 * @author Verdient。
	 */
	static table(data){
		const chars = {
			'top': '─',
			'top-mid': '┬',
			'top-left': '┌',
			'top-right': '┐',
			'bottom': '─',
			'bottom-mid': '┴',
			'bottom-left': '└',
			'bottom-right': '┘',
			'left': '│',
			'left-mid': '├',
			'mid': '─',
			'mid-mid': '┼',
			'right': '│',
			'right-mid': '┤',
			'middle': '│'
		}

		const style = {
			'left-padding': 2,
			'right-padding': 2,
			'min-width': 60
		}

		const buildTitle = (title, length) => {
			let leftPadding = style['left-padding'];
			let rightPadding = style['right-padding'];
			let motifyedLeftPadding = leftPadding;
			let motifyedRightPadding = rightPadding;
			let top = cliColor.cyan(chars['top-left']);
			let middle = cliColor.cyan(chars['left']);
			let bottom = cliColor.cyan(chars['left-mid']);
			let valueLength = 0;
			let leftLength = 0;
			title.forEach((value, index) => {
				motifyedLeftPadding = leftPadding;
				motifyedRightPadding = rightPadding;
				value = String(value);
				valueLength = value.length;
				if(value.match(/[\u4E00-\u9FA5]/g)){
					valueLength += value.match(/[\u4E00-\u9FA5]/g).length;
				}
				leftLength = length[index] - valueLength;
				if(leftLength > 0){
					if(leftLength % 2 == 0){
						motifyedLeftPadding += leftLength / 2;
						motifyedRightPadding += leftLength / 2;
					}else{
						motifyedLeftPadding += (leftLength + 1) / 2;
						motifyedRightPadding += (leftLength - 1) / 2;
					}
				}
				top += cliColor.cyan(chars['top'].repeat(length[index] + leftPadding + rightPadding));
				middle += cliColor.cyan(' '.repeat(motifyedLeftPadding)) + cliColor.red(value) + cliColor.cyan(' '.repeat(motifyedRightPadding));
				bottom += cliColor.cyan(chars['bottom'].repeat(length[index] + leftPadding + rightPadding));
				if(index < title.length -1){
					top += cliColor.cyan(chars['top-mid']);
					middle += cliColor.cyan(chars['left']);
					bottom += cliColor.cyan(chars['mid-mid']);
				}else{
					top += cliColor.cyan(chars['top-right']);
					middle += cliColor.cyan(chars['right']);
					bottom += cliColor.cyan(chars['right-mid']);
				}
			});
			return top + '\n' + middle + '\n' + bottom + '\n';
		}

		const buildBody = (body, length) => {
			let leftPadding = style['left-padding'];
			let rightPadding = style['right-padding'];
			let motifyedLeftPadding = leftPadding;
			let motifyedRightPadding = rightPadding;
			let middle = '';
			let bottom = '';
			let rowString = '';
			let leftLength = 0;
			let valueLength = 0;
			body.forEach((row, index) => {
				middle = cliColor.cyan(chars['left']);
				if(index < body.length -1){
					bottom = cliColor.cyan(chars['left-mid']);
				}else{
					bottom = cliColor.cyan(chars['bottom-left']);
				}
				row.forEach((value, col) => {
					motifyedLeftPadding = leftPadding;
					motifyedRightPadding = rightPadding;
					value = String(value);
					valueLength = value.length;
					if(value.match(/[\u4E00-\u9FA5]/g)){
						valueLength += value.match(/[\u4E00-\u9FA5]/g).length;
					}
					leftLength = length[col] - valueLength;
					if(leftLength > 0){
						if(leftLength % 2 == 0){
							motifyedLeftPadding += leftLength / 2;
							motifyedRightPadding += leftLength / 2;
						}else{
							motifyedLeftPadding += (leftLength + 1) / 2;
							motifyedRightPadding += (leftLength - 1) / 2;
						}
					}
					middle += cliColor.cyan(' '.repeat(motifyedLeftPadding)) + value + cliColor.cyan(' '.repeat(motifyedRightPadding));
					bottom += cliColor.cyan(chars['bottom'].repeat(length[col] + leftPadding + rightPadding));
					if(col < row.length -1){
						middle += cliColor.cyan(chars['left']);
						if(index < body.length -1){
							bottom += cliColor.cyan(chars['mid-mid']);
						}else{
							bottom += cliColor.cyan(chars['bottom-mid']);
						}
					}else{
						middle += cliColor.cyan(chars['right']) + '\n';
						if(index < body.length -1){
							bottom += cliColor.cyan(chars['right-mid']) + '\n';
						}else{
							bottom += cliColor.cyan(chars['bottom-right']);
						}
					}
				});
				rowString += middle + bottom;
			});
			return rowString;
		}

		let processedData = [];
		let title = new Set();
		let lengthMap = {};

		if(Array.isArray(data)){
			let titleLength = 0;
			let valueLength = 0;
			let indexLength = 0;
			let colLength = 0;
			data.forEach((value, index) => {
				if(objectHelper.isPlainObject(value)){
					for(let i in value){
						i = String(i);
						value[i] = String(value[i]);
						title.add(i);
						titleLength = i.length;
						valueLength = value[i].length;
						if(i.match(/[\u4E00-\u9FA5]/g)){
							titleLength += i.match(/[\u4E00-\u9FA5]/g).length;
						}
						if(value[i].match(/[\u4E00-\u9FA5]/g)){
							valueLength += value[i].match(/[\u4E00-\u9FA5]/g).length;
						}
						colLength = titleLength > valueLength ? titleLength : valueLength;
						if(!lengthMap[i]){
							lengthMap[i] = 0;
						}
						if(colLength > lengthMap[i]){
							lengthMap[i] = colLength;
						}
					}
					if(index == data.length - 1){
						data.forEach(value => {
							let row = [];
							for(let name of title){
								row.push(value[name] || '');
							}
							processedData.push(row);
						})
					}
				}else if(objectHelper.inArray(objectHelper.type(value), ['number', 'string'])){
					title.add('index');
					title.add('value');
					value = String(value);
					indexLength = String(index).length;
					titleLength = indexLength > 5 ? indexLength : 5;
					valueLength = value.length > 5 ? value.length : 5;
					if(value.match(/[\u4E00-\u9FA5]/g)){
						valueLength += value.match(/[\u4E00-\u9FA5]/g).length;
					}
					lengthMap.index = titleLength;
					if(!lengthMap.value){
						lengthMap.value = 0;
					}
					if(valueLength > lengthMap.value){
						lengthMap.value = valueLength;
					}
					processedData.push([index, value]);
				}else{
					throw new Error('Unsupported data type: ' + objectHelper.type(value));
				}
			})
		}else if(objectHelper.isPlainObject(data)){
			let titleLength = 0;
			let valueLength = 0;
			let indexLength = 0;
			title.add('index');
			title.add('value');
			let value = '';
			for(let i in data){
				if(objectHelper.inArray(objectHelper.type(data[i]), ['number', 'string'])){
					i = String(i);
					value = String(data[i]);
					title.add('index');
					title.add('value');
					indexLength = String(i).length;
					valueLength = value.length;
					if(i.match(/[\u4E00-\u9FA5]/g)){
						indexLength += i.match(/[\u4E00-\u9FA5]/g).length;
					}
					if(value.match(/[\u4E00-\u9FA5]/g)){
						valueLength += value.match(/[\u4E00-\u9FA5]/g).length;
					}
					titleLength = indexLength > 5 ? indexLength : 5;
					valueLength = valueLength > 5 ? valueLength : 5;
					lengthMap.index = titleLength;
					if(!lengthMap.value){
						lengthMap.value = 0;
					}
					if(valueLength > lengthMap.value){
						lengthMap.value = valueLength;
					}
					processedData.push([i, value]);
				}else{
					throw new Error('Unsupported data type: ' + objectHelper.type(data[i]));
				}
			}
		}
		let minWidth = style['min-width'];
		let length = [];
		title = Array.from(title);
		title.forEach(value => {
			length.push(lengthMap[value]);
		});
		let totalWidth = 0;
		length.forEach(colLength => {
			totalWidth += colLength;
		});
		if(totalWidth < minWidth){
			let fillLength = Math.floor((minWidth - totalWidth) / length.length);
			length.forEach((colLength, index) => {
				length[index] += fillLength;
			});
		}
		console.log(buildTitle(title, length) + buildBody(processedData, length));
	}
}

module.exports = Console;