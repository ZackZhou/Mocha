/**
 * @author ：ZackZhou
 * @date ：Created in 2021/5/5 09:53 PM
 * @description ： 用来设置环境变量
 * @modified By：
 * @version:
 */

var config = {
    //debug 为true时，用于本地调试
    debug: true,
    hostname: 'localhost',//域名
    port: '30001',
    protocol:'http:',
    'Content-Type': 'application/json' // 默认请求的头
}

module.exports = config;