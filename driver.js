/**
 * @author ：ZackZhou
 * @date ：Created in 2021/5/5 09:53 PM
 * @description ： 请求发送类
 * @modified By：
 * @version:
 */

var config = require("./config")
const http = require("http")

class Driver {
    constructor() { }

    static call = function (model, assertions, call_back) { // 统一的请求方式，传入模型与校验方法，校验方法接受两个参数，第一个是响应码，第二个为响应体
        const req = http.request(model, (res) => {
            var chunks = [];

            res.setEncoding('utf8'); // 设置字符集

            res.on('data', (chunk) => {
                chunks.push(chunk)
            });

            res.on('end', () => {
                if (config.debug) {
                    console.log(`响应头: ${JSON.stringify(res.headers)}`);
                    console.log(`响应体: ${chunks}`);
                    console.log(`请求参数： ${model.get_detail()}`);
                }

                var json_obj = JSON.parse(chunks)
                
                try{
                    assertions(res.statusCode, json_obj);
                    call_back()
                }catch(err){
                    console.log("失败！")
                    call_back(err)
                }
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });

        // 写入数据到请求主体
        req.write(model.body);
        req.end();
    }
}

module.exports = Driver