## nodejs server 端部署


- install node
- npm install express
- npm install ejs
- npm install mongoose
- npm install mongoose-types
- npm install http-proxy
- npm install seajs
- npm install crypto
- npm install passport     # auth 模块, 以下 passport-xx 模块可视需要安装
- npm install passport-local
- npm install passport-oauth
- npm install passport-google
- npm install passport-sina
- install mongodb        # http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
- start mongodb          # /path/to/mongod --dbpath=/Users/shengyan/software/db/

- 启动server
- node server.js # start server.js   listen 8888
- sudo node proxy.js # start proxy.js   listen 80



## 线上部署

- npm install forever

相关命令参考 http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever

简单如下:

- forever start server.js
- forever list
- ps axl | grep node
- kill 进程号
- forever stop 0