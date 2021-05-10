一个简单的基于　mocha 的测试项目，含　mock server
Linux 环境下：
1. 安装nodejs, 使用skdman 安装
2. npm -g install mocha
3. npm -g install supervisor
4. npm -g install mochawesome
5. 配置 confg.js -- 默认无需需改
6. cd Mocha/server
7. supervisor server.js
8. cd Mocha
9. mocha --reporter mochawesome
