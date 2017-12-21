var http = require('http');
var querystring = require('querystring');
 
var contents = querystring.stringify({
	'type':'catid|24',
	'page':'2',
	'_csrf':'oRyxMW-ij5TbKYb9sYZalCOX0yQ6VPl7i1KF8yPCuojnrQQ2KxY6k5K6iRtzQxuOwaNv4zmEsIbte7lRDSQvEQ==',
	'_':'1513836728286'
});
 
var options = {
    host:'www.cnbeta.com',
    path:'/home/more',
    method:'POST',
    headers:{
        'Content-Type':'application/x-www-form-urlendcoded',
        'Content-Length':contents.length
    }
};
 
var req = http.request(options, function(res){
    res.setEncoding('utf8');
    res.on('data',function(data){
        console.log("data:",data);   //一段html代码
    });
});
 
req.write(contents);
req.end;