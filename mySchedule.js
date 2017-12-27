/**
 * 定时任务
 */

var schedule = require("node-schedule");
var MongoDB = require('./dbUtil');

var rule = new schedule.RecurrenceRule();

rule.hour = 15;
rule.minute = 49;

/**
 * 每天24点清除数据，重新获取
 */
var newsJob = schedule.scheduleJob(rule, function(){
	MongoDB.remove("news",{},function(err,res){
	});
});

var blogsJob = schedule.scheduleJob(rule, function(){
	MongoDB.remove("blogs",{},function(err,res){
	});
});

var vediosJob = schedule.scheduleJob(rule, function(){
	MongoDB.remove("vedios",{},function(err,res){
	});
});