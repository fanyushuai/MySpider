/**
 * 定时任务
 */

var schedule = require("node-schedule");
var MongoDB = require('./dbUtil');
var mySpiderOSChina = require('./mySpiderOSChina');
var mySpiderCnbeta = require('./mySpiderCnbeta');

var rule = new schedule.RecurrenceRule();

rule.hour = 14;
rule.minute = 32;


/**
 * 每天24点清除数据，重新获取
 */

var newsJob = schedule.scheduleJob(rule, function(){
	MongoDB.remove("news",{},function(err,res){
		console.log("清除新闻");
		mySpiderCnbeta.cnBeta();
	});
});

var blogsJob = schedule.scheduleJob(rule, function(){
	MongoDB.remove("blogs",{},function(err,res){
		console.log("清除博客");
		mySpiderOSChina.osChina();
	});
});

/**
var vediosJob = schedule.scheduleJob(rule, function(){
	MongoDB.remove("vedios",{},function(err,res){});
});**/