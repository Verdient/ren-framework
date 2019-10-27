'use strict'

/**
 * eachSeries(Object tasks, Callable callback)
 * 按顺序执行
 * -------------------------------------------
 * @param {Object} tasks 任务集合
 * @param {Callable} callback 回调函数
 * ----------------------------------
 * @return {Promise}
 * @author Verdient。
 */
let eachSeries = (tasks, callback) => {
	return new Promise((resolve, revoke) => {
		let tasksSet = [];
		for(let key in tasks){
			tasksSet.push({
				key: key,
				value: tasks[key]
			});
		}
		let length = tasksSet.length;
		let run = (n) => {
			let task = tasksSet[n];
			callback(task.value, task.key, (error) => {
				if(error){
					revoke(error);
				}else if(n < length - 1){
					n++;
					run(n);
				}else{
					resolve();
				}
			});
		}
		if(length > 0){
			run(0);
		}else{
			resolve();
		}
	});
}

/**
 * each(Object tasks, Callable callback)
 * 同时执行
 * -------------------------------------
 * @param {Object} tasks 任务集合
 * @param {Callable} callback 回调函数
 * ----------------------------------
 * @return {Promise}
 * @author Verdient。
 */
let each = (tasks, callback) => {
	let count = tasks.length;
	let n = 0;
	return new Promise((resolve, revoke) => {
		if(count === 0){
			resolve();
		}else{
			tasks.forEach((element, index) => {
				callback(element, index, (error) => {
					if(error){
						revoke(error);
					}else{
						n++;
						if(n === count){
							resolve();
						}
					}
				});
			});
		}
	});
}

module.exports = {
	eachSeries,
	each
}