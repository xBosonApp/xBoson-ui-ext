# xBoson 内核的前端文件渲染器

java 内核的 js 语言为 es5 的古旧版本, 为了支持 ts/tsx/jsx/... 语法, 将最新的编译器用 es5 语法编译
并装入 xboson 内核中.

为前端文件提供 vue/jsx/sass/pug/stylus/less/... 解析器合渲染器.


# 安装

`npm i`

`npm i -g webpack`


# 启动服务器

`npm start`

Shell 环境变量:

* port : 服务器启动后绑定的服务端口, 默认 7788


# 编译并集成 (失败)

`npm run build`

dist/ 目录中的文件部署到 xBoson 内核.


# 协议设计

用 WebSocket 作为数据通信协议.

## 协议框架

字节顺序, 应答与请求相同, 对应的应答id与请求id相同.

字节    长度     说明
0       1        功能代码
1       8        消息id, 如果当前消息需要应答, 则应答与请求id相同
9       1        后置数据包数量 n, 最多255个包
{ 数据包长度字段数量 = n
10      4        第1个数据包的长度(字节) x1
10+n*4  4        第n个数据包长度 x
}
{
10+n*4  x(n)     第n个数据包
}

### 功能 1, 请求可解析文件扩展名

请求数据包长度 0
使用功能5 应答

### 功能 2, 请求渲染文件

请求数据包长度 3,
数据包1: 文件名
数据包2: 文件内容
数据包3: json 作为渲染参数, 至少提供一个空的 json: '{}'

使用功能 3/4 进行应答

### 功能 3, 应答渲染文件

应答数据包长度 2+n
数据包1: 渲染后的文件
数据包2: 文件的 mime-type
数据包n: 依赖文件1, 渲染文件本身不存储于该列表中, n>=0
数据包n+1: 依赖文件1+n

### 功能 4, 错误

应答数据包长度 1
数据包1: 错误消息

### 功能 5, 应答文件扩展名

数据包长度 1
数据包内容: 以空格分隔的扩展名列表,
'.ts' 描述 typescript 可解析;

### 功能 6, 请求原始文件

数据包长度 1,
数据包1: 文件名
使用功能 4/7 应答

### 功能 7, 应答单个依赖文件

数据包长度 1,
数据包1: 文件内容

依赖文件的 消息id 与主文件的 消息id 必须相同.
主文件的 6/7 消息总是呈现队列顺序调用, 一个请求一个应答.


## 参考

* [xBoson平台运算核心](https://github.com/yanmingsohu/xBoson-core)
* [编译器, 将新的js代码转换为旧的js](https://babel.docschina.org/)
* [JSX 简介](https://react.docschina.org/docs/introducing-jsx.html)
* [TypeScript](https://www.tslang.cn/docs/handbook/migrating-from-javascript.html)