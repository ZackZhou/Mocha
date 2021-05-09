一个简单的基于　mocha 的测试项目，含　mock server
Linux 环境下：
1. 安装nodejs, 使用skdman 安装
2. 安装 mocha, 并设置 alias,　npm -g install mocha
3. npm 安装　supervisor, npm -g install supervisor
4. 安装　mochawesome，　npm -g install mochawesome
5. 配置 confg.js
6. cd 到 airwallex/server
7. supervisor server.js
8. cd airwallex
9. mocha --reporter mochawesome
