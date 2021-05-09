var assert = require('assert');

var Bank = require('../models/bank')
var Driver = require('../driver');

describe('suite', function () {
    before(function () {
        console.log('before suite')
    })

    after(function () {
        console.log('after suite')
    })

    describe('happy pass testing -- test', function () {
        it('case1 - happy pass', function (done) {
            var bank = new Bank();

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });
    })

    describe('mandatory testing -- test', function () {
        it('case2 - missing bank_country_code', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                delete it.bank_country_code
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "bank_country_code is required")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case3 - missing account_name', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                delete it.account_name
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "account_name is required")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case4 - missing account_number', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                delete it.account_number
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "account_number is required")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case5 - missing payment_method', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                delete it.payment_method
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "payment_method is required")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case6 - missing swift_code when payment_method is SWIFT ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.payment_method = 'SWIFT'
                delete it.swift_code
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "swift_code is required")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case7 - missing bsb when bank_country_code is AU ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'AU'
                delete it.bsb
                it.account_name = '1234677'
                it.swift_code = 'ICBCAUBJ'
                it.account_number = '123456'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "bsb is required")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case8 - missing aba when bank_country_code is US ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'US'
                delete it.aba
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "aba is required")
                }, (err) => { err ? done(err) : done() }
            )
        });
    })

    describe('length testing -- test', function () {
        it('case1 - account name: mandatory, any character, length from 2 to 10 -- short than 2', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.account_name = '1'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "account_name length should be from 2 to 10")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case2 - account name: mandatory, any character, length from 2 to 10 -- longer than 10', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.account_name = '12345678901'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "account_name length should be from 2 to 10")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case3 - account name: mandatory, any character, length from 2 to 10 -- equal to 10', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.account_name = '1234567890'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case4 - account name: mandatory, any character, length from 2 to 10 -- equal to 2', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.account_name = '12'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case５ -　bsb 6 characters when bank_country_code is AU ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'AU'
                it.bsb = '123456'
                it.account_name = '1234677'
                it.swift_code = 'ICBCAUBJ'
                it.account_number = '1234567'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case6 - aba 9 characters when bank_country_code is US ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'US'
                it.aba = '123456789'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case７ -　bsb not 6 characters when bank_country_code is AU ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'AU'
                it.bsb = '1234567'
                it.account_name = '1234677'
                it.swift_code = 'ICBCAUBJ'
                it.account_number = '1234567'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error.indexOf("size should be 6") >= 0, true)
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case８ - aba not 9 characters when bank_country_code is US ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'US'
                it.aba = '1234567891'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error.indexOf("size should be 9") >= 0, true)
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case9 - Length of account_number should be between 7 and 11 when bank_country_code is US ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'US'
                it.account_number = '1231231231231231213123123123132123132131asdfasdfasdfasdfasdfsdf'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error,"Length of account_number should be between 7 and 11 when bank_country_code is 'US'")
                }, (err) => { err ? done(err) : done() }
            )
        });
    })

    describe('vocabulary testing -- test', function () {
        it('case1 - payment_method should be either LOCAL or SWIFT, not local or swift', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.payment_method = 'test'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "payment_method either be LOCAL or SWIFT")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case2 - payment_method should be either LOCAL or SWIFT. LOCAL ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.payment_method = 'LOCAL'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case3 - payment_method should be either LOCAL or SWIFT. SWIFT ', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.payment_method = 'SWIFT'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case4 - bank_country_code can be one of US, AU, CN.  -- US', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'US'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 200)
                    assert.strictEqual(response.success, "Bank details saved")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case5 - bank_country_code can be one of US, AU, CN.  -- AU -- account number not fullfilled', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'AU'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "for AU, account number is 6-9 character long")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case6 - bank_country_code can be one of US, AU, CN.  -- CN -- The swift code is not valid for the given bank country code: US', function (done) {
            var bank = new Bank();
            bank.update((it) => {
                it.bank_country_code = 'CN'
                it.account_number = '1234566788'
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "The swift code is not valid for the given bank country code: US")
                }, (err) => { err ? done(err) : done() }
            )
        });
    })

    describe('exploring testing -- test', function () {
        it('case1 - too long account name', function (done) {
            var bank = new Bank();

            bank.update((it) => {
                it.account_name = "123123123adf!@#SDFDV$@$#%#$DSASD@!#Dvdzafgadfgadfgadsfa1    aqe rrq            56357adsv"
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "account_name length should be from 2 to 10")
                }, (err) => { err ? done(err) : done() }
            )
        });

        it('case2 - empty account name', function (done) {
            var bank = new Bank();

            bank.update((it) => {
                it.account_name = ""
            })

            Driver.call(bank,
                (statusCode, response) => {
                    assert.strictEqual(statusCode, 400)
                    assert.strictEqual(response.error, "account_name length should be from 2 to 10")
                }, (err) => { err ? done(err) : done() }
            )
        });
    })
})