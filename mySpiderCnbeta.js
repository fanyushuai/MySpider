var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var MongoDB = require('./dbUtil');
var i = 0;
var url = "";
// 初始url

exports.cnBeta = function () {
	// 采用http模块向服务器发起一次get请求
	http.get('http://www.cnbeta.com/category/funny.htm',function(res) {
		var html = ''; // 用来存储请求网页的整个html内容
		var titles = [];
		res.setEncoding('utf-8'); // 防止中文乱码
		// 监听data事件，每次取一块数据
		res.on('data', function(chunk) {
			html += chunk;
		});
		// 监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
		res.on('end', function() {
			var $ = cheerio.load(html); // 采用cheerio模块解析html
			$(".items-area .item").each(function(index,item){
				var title = $(item).children("dl").children("dt").children("a").text();
				var create_time = $(item).find(".status li").text();
				var author_name = "趣闻";
				create_time = new Date(create_time.substring(3,create_time.indexOf("|")).trim());
				
				var detailUrl = $(item).children("dl").children("dt").children("a").attr("href");
				if(!$(item).hasClass("cooperation")){
					
					//去找详情
					http.get(detailUrl,function(res2) {
						var html = ''; // 用来存储请求网页的整个html内容
						res2.setEncoding('utf-8'); // 防止中文乱码
						// 监听data事件，每次取一块数据
						res2.on('data', function(chunk) {
							html += chunk;
						});
						// 监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
						res2.on('end', function() {
							var $ = cheerio.load(html);
							var content = $(".article-summary").html()+$(".article-content").html();
							
							MongoDB.save("news", {title:title,author_name:author_name,content:content,create_time:create_time}, function (err, rs) {
								console.log(rs);
							});
						});
					}).on('error', function(err) {
						console.log("获取详情信息错误："+err);
						process.exit();
					});
				};
			});
		});
	}).on('error', function(err) {
		console.log(err);
		process.exit();
	});
};

//this.startRequest(); // 主程序开始运行
