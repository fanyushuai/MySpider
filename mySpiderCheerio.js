var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var MongoDB = require('./dbUtil');
var i = 0;
var url = "http://hot.cnbeta.com/articles/funny/680201.htm";
// 初始url

function fetchPage(x) { // 封装了一层函数
	startRequest(x);
}

function startRequest(x) {
	// 采用http模块向服务器发起一次get请求
	http.get(x,function(res) {
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
			console.log($("GV.DETAIL").val());
			var time = $('.meta span').eq(0).text().trim();
			var title = $(".title h1").text().trim();
			var author_name = $(".source").text().trim();
			var content = $(".article-summary p").eq(0).text().trim();
			var cover = $(".article-content p").eq(0).find("img").attr("src");
			
			// 下一篇文章的url
			var nextLink = "http://www.cnbeta.com/"+ $("a.page-next").attr('href');
			console.log(nextLink);
			
			// 这是亮点之一，通过控制I,可以控制爬取多少篇文章.
			if (i <= 500) {
				fetchPage(nextLink);
			}
		});

	}).on('error', function(err) {
		console.log(err);
	});

}

function testRequest(){
	request("http://hot.cnbeta.com/comment/read?_csrf=dLvbbJbTgE7GMekonXjgeWrmy25-oyl-5rrdGnmiPCLYqH8ttIcAtT88c9eZNi-OiW6pyO3SVYldzk7SmrctjA%3D%3D&op=1%2C680207%2C7b6a3", function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	data = JSON.parse(body);
	    	console.log(data);
	    } else {
	    }
	});
}

testRequest();
//fetchPage(url); // 主程序开始运行
