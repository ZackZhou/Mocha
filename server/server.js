var http = require('http');
var path = require('path')
var bank_body_validate = require('./rules/bank_rule')

var pages = [
    {
        url: 'bank', output: function (req, res) {
            // 定义了一个post变量，用于暂存请求体的信息
            var post = '';

            // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
            req.on('data', function (chunk) {
                post += chunk;
            });

            req.on('end', function () {
                bank_body_validate(res, post)
                if (!res.writableEnded) {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end('{"success": "Bank details saved"}');
                }
            });
        }
    }
]

http.createServer(function (req, res) {
    var base_path = path.basename(decodeURI(req.url))
    console.log("访问　" + base_path)

    var found = false;
    pages.forEach((page) => {
        if (page.url === base_path) {
            page.output(req, res);
            found = true;
        }
    });

    if (!found) { // 暂时不清楚为何不能用　 writableEnded 来判断
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end('{"error": "Page Not Found"}');
    }

}).listen(30001)