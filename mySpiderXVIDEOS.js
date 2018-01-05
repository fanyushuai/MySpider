var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var MongoDB = require('./dbUtil');
var url = "https://www.xvideos.com/new/";

// 初始url
exports.xvideo = function () {
	console.log('开始获取视频');
	for(var i=1;i<=10;i++){
		// 采用http模块向服务器发起一次get请求
		https.get(url+i,function(res) {
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
				
				$(".thumb-block").each(function(index,item){
					var title = $(item).find("p").eq(0).find("a").attr("title");
					var pic = $(item).find(".thumb").find("a").find("img").attr("data-src");
					var length = $(item).find(".duration").text();
					var detailUrl = "https://www.xvideos.com"+$(item).find(".thumb").find("a").attr("href");
					
					//进入详情页面查找视频url
					
					https.get(detailUrl,function(res2) {
						var html = ''; // 用来存储请求网页的整个html内容
						var titles = [];
						res2.setEncoding('utf-8'); // 防止中文乱码
						// 监听data事件，每次取一块数据
						res2.on('data', function(chunk) {
							html += chunk;
						});
						// 监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
						res2.on('end', function() {
							var $ = cheerio.load(html);
							var url = $("#html5video div a").attr("href");
							MongoDB.save("videos", {title:title,pic:pic,url:url,length:length}, function (err, rs) {
							});
						});
					}).on('error', function(err) {
						console.log("获取详情信息错误："+err);
						process.exit();
					});
				});
			});
		}).on('error', function(err) {
			console.log("获取基本信息错误："+err);
			process.exit();
		});
	}
	console.log('获取视频结束');
};

//this.xvideo(); // 主程序开始运行
