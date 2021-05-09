/**
 * @author ：ZackZhou
 * @date ：Created in 2021/5/5 09:53 PM
 * @description ： 所有请求类的基类， 请求类自己可以覆盖对应的属性
 * @modified By：
 * @version:
 */

var config = require("./config")

class BaseModel {
    protocol = config.protocol
    hostname = config.hostname
    port = config.port
    path = ''
    method = 'get' // 默认设置为get

    body = '' // 默认为空，如果是post 请求，子类需设置

    headers = {
        'Content-Type': config["Content-Type"]
    }

    queries = {}
    parameters = {}
    paths = {}

    constructor() { }

    update = function (body_update_actions) {
        var json_obj = JSON.parse(this.body)
        body_update_actions(json_obj)

        this.body = JSON.stringify(json_obj)
    }

    get_detail = () => {
        return this.protocol + this.hostname + ":" + this.port + "/" + this.path
            + ' - method: ' + this.method + ' - body: ' + this.body
            + ' - headers: ' + this.headers + ' - queries: ' + this.queries
            + ' - parameters: ' + this.parameters + ' - paths: ' + this.paths
    }

    static generate = () => {
        return new this()
    }
}

module.exports = BaseModel