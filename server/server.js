var http = require('http');
var path = require('path')

function error_json(info) {
    return `{"error": "${info}"}`
}

function write_before_end(res, info) {
    if (!res.writableEnded) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(error_json(info))
    }
}

function mandatory_check(res, body_obj, key) {
    if ((body_obj[key] === undefined)) {
        write_before_end(res, `${key} is required`);
    }
}

function value_lenght_check(start, end, value) {
    console.log(value + " 当前长度： " + value.length)

    if (value.length < start || value.length > end)
        return false;
    else
        return true;
}

function value_fix_lenght_check(res, size, value) {
    if (value.length !== size) {
        write_before_end(res, `${value} size should be ${size}`);
    }
}

function body_validate(res, body) {
    if (!body) {
        write_before_end(res, "Enpty Request Body");
    }

    try {
        var body_obj = JSON.parse(body);
        var mandatory_check_list = ['payment_method', 'bank_country_code', 'account_name', 'account_number']

        mandatory_check_list.forEach((item) => {
            mandatory_check(res, body_obj, item)
        })

        if (!(body_obj.payment_method === 'LOCAL' || body_obj.payment_method === 'SWIFT')) {
            write_before_end(res, "payment_method either be LOCAL or SWIFT");
        }

        if (!(body_obj.bank_country_code === 'US' || body_obj.bank_country_code === 'AU' || body_obj.bank_country_code === 'CN')) {
            write_before_end(res, "bank_country_code should be one of US,AU,CN");
        }

        if (!value_lenght_check(2, 10, body_obj.account_name)) {
            write_before_end(res, "account_name length should be from 2 to 10");
        }

        switch (body_obj.bank_country_code) {
            case 'US':
                if (!value_lenght_check(1, 17, body_obj.account_number)) {
                    write_before_end(res, "Length of account_number should be between 7 and 11 when bank_country_code is 'US'");
                }
                break;
            case 'AU':
                if (!value_lenght_check(6, 9, body_obj.account_number)) {
                    write_before_end(res, "for AU, account number is 6-9 character long");
                }
                break;
            case 'CN':
                if (!value_lenght_check(8, 20, body_obj.account_number)) {
                    write_before_end(res, "for CN, account number is 8-20 character long");
                }
                break;
            default:
                break;
        }

        if (body_obj.payment_method === 'SWIFT') {
            mandatory_check(res, body_obj, 'swift_code')
        }

        if (!(body_obj.swift_code.length === 8 || body_obj.swift_code.length === 11)) {
            write_before_end(res, "Length of 'swift_code' should be either 8 or 11");
        }

        var sub_code = body_obj.swift_code.substr(4, 2)
        if (sub_code !== body_obj.bank_country_code) {
            write_before_end(res, "The swift code is not valid for the given bank country code: " + sub_code);
        }

        if (body_obj.bank_country_code === 'AU') {
            mandatory_check(res, body_obj, 'bsb')
            value_fix_lenght_check(res, 6, body_obj.bsb);
        }

        if (body_obj.bank_country_code === 'US') {
            mandatory_check(res, body_obj, 'aba')
            value_fix_lenght_check(res, 9, body_obj.aba);
        }
    } catch (err) {
        write_before_end(res, "Body is not valiad Json");
    }
}


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
                body_validate(res, post)
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