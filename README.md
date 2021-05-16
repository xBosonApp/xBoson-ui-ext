# TypeScript 语言的 xBoson 内核

java 内核的 js 语言为 es5 的古旧版本, 为了支持 ts/tsx/jsx/... 语法, 将最新的编译器用 es5 语法编译
并装入 xboson 内核中.

为前端文件提供 vue/jsx/sass/pug/stylus/less/... 解析器


# 安装

`npm i -g webpack`


# 编译

`npm run build`

dist/ 目录中的文件部署到 xBoson 内核.


# 参考

编译器, 将新的js代码转换为旧的js
https://babel.docschina.org/

JSX 简介
https://react.docschina.org/docs/introducing-jsx.html

TypeScript
https://www.tslang.cn/docs/handbook/migrating-from-javascript.html