var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var MongoDB = require('./dbUtil');
var i = 0;
var url = "https://www.oschina.net/action/ajax/get_more_recommend_blog?classification=0&p=1";
// 初始url


function startRequest(url) {
	// 采用http模块向服务器发起一次get请求
	https.get(url,function(res) {
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
			$(".box-aw").each(function(index,item){
				var time = $(item).find("footer span").eq(2).text();
				var title = $(item).find("header a").attr("title");
				var author_name = $(item).find("footer span").eq(0).text();
				var content = "";
				/**getContent($(item).find("header a").attr("href"),function (err, res){
					content = res;
					console.log(content);
				});
				var cover = "";**/
				
				https.get($(item).find("header a").attr("href"),function(res2) {
					var html = ''; // 用来存储请求网页的整个html内容
					var titles = [];
					res2.setEncoding('utf-8'); // 防止中文乱码
					// 监听data事件，每次取一块数据
					res2.on('data', function(chunk) {
						html += chunk;
					});
					// 监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
					res2.on('end', function() {
						var $ = cheerio.load(html); // 采用cheerio模块解析html
						//console.log($(".BlogContent").text());
						content = $(".BlogContent").html();
						
						MongoDB.save("blogs", {title: title,author_name:author_name,content:content}, function (err, rs) {
							//console.log(rs);
						});
					});

				}).on('error', function(err) {
					console.log("获取详情信息错误："+err);
				});
			});
		});

	}).on('error', function(err) {
		console.log("获取基本信息错误："+err);
	});

}

/**
function getContent(url){
	request(url, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	console.log(body);
	    } else {
	    }
	});
}**/

getContent = function(url,callback){
	https.get(url,function(res) {
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
			//console.log($(".BlogContent").text());
			callback(null, $(".BlogContent").text());
		});

	}).on('error', function(err) {
		console.log(err);
	});
};


//getContent("https://my.oschina.net/LiPengYue/blog/1591282",function(err,res){
	//console.log(res);
//});

startRequest(url); // 主程序开始运行
