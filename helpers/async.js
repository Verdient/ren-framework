'use strict'

/**
 * 按顺序执行
 * @param {Object} tasks 任务集合
 * @param {Callable} iteratee 回调函数
 * @return {Promise}
 * @author Verdient。
 */
let eachSeries = (tasks, iteratee) => {
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
			iteratee(task.value, task.key, (error) => {
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
 * 同时执行
 * @param {Object} tasks 任务集合
 * @param {Callable} iteratee 回调函数
 * @return {Promise}
 * @author Verdient。
 */
let each = (tasks, iteratee) => {
	return new Promise((resolve, revoke) => {
		let count = tasks.length;
		if(count === 0){
			resolve();
		}else{
			let n = 0;
			for(let i = 0; i < count; i++){
				let element = tasks[i];
				iteratee(element, i, (error) => {
					n++;
					if(error){
						revoke(error);
					}else{
						if(n === count){
							resolve();
						}
					}
				});
			}
		}
	});
}

let times = (times, iteratee) => {
	return new Promise((resolve, revoke) => {
		if(times <= 0){
			resolve([]);
		}else{
			let n = 0;
			let results = {};
			for(let i = 1; i <= times; i++){
				iteratee(i, (error, result) => {
					n++;
					if(error){
						revoke(error);
					}else{
						results[i] = result;
						if(n >= times){
							resolve(Object.values(results));
						}
					}
				});
			}
		}
	});
}

module.exports = {
	eachSeries,
	each,
	times
}