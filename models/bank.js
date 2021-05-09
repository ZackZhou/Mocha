/**
 * @author ：ZackZhou
 * @date ：Created in 2021/5/5 09:53 PM
 * @description ： 每个请求URL的配置， 如果有swagger或者其他来源，可以通过自动化工具生成每个请求类
 * @modified By：
 * @version:
 */

const BaseModel = require("../model");

class Bank extends BaseModel {
    path = '/bank'
    method = 'post'

    body = '{"payment_method": "SWIFT", "bank_country_code": "US","account_name": "John Smith","account_number": "123","swift_code": "ICBCUSBJ","aba": "11122233A" }'
}

module.exports = Bank