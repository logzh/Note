##前端XXX(未完、持续更新)

* 前端标准/规范
  * 1
  * 1
* 代码规范
  * 1
  * 1
* 编程语言
  * 1
  * 1
* 开发工具
  * webstorm
  * sublime
  * vi
* 前端库和框架
 * jQuery、zepto
 * underscore
 * AngularJS、Backbone、React、vue.js
 * Bootstrap、Semantic UI
* 代码组织
  * 类库模块化
     * CommonJS/AMD
     * webpack
     * bower
  * 模块化预处理器
     * Browserify
  * 文件加载
     * requirejs
     * seajs
* 安全
* 测试
* 部署流程
  * 压缩合并
     * 1
     * 1
  * 文档输出
      * 1
      * 1
  * 项目构建工具
     * gulp
     * grunt

##流程

####方案一

1. 开发阶段：使用webpack进行调试、打包、模块管理。（webpack对应的开发环境配置文件）
2. 自动构建阶段：使用gulp进行压缩、合并、重命名等任务（webpack对应的生产环境配置文件，包括部分压缩任务）
3. 发布、部署：先全量部署静态资源（图片、js、css）到CDN，再灰度部署页面。参考文章，[怎么开发和部署前端代码](https://github.com/fouber/blog/issues/6) 。

问题：

1. 需要资源表

解决：

1. 方法一：构建时产生资源表
2. 方法二：如果是纯前端项目，可以使用fis3解决，非常简单，参考[FIS3 , 为你定制的前端工程构建工具](http://fis.baidu.com/fis3/docs/build.html)

资源内嵌、定位资源、依赖声明

```bash
fis3 install
fis3 release
fis3 server
```

####方案二（最低要求）

1. 开发阶段：requirejs模块管理
2. 自动构建阶段：使用gulp进行压缩、合并等任务
3. 发布、部署：打包部署到服务器或CDN，页面加载资源使用链接加版本参数的方式进行（?v=123）

问题：

![wwq.png](https://raw.githubusercontent.com/logzh/bookmark/master/image/wwq.png)

##组件化解决方案

####方案一：react

[ant-design](https://github.com/ant-design/ant-design)

demo： 

1. [react reflux todo](https://github.com/logzh/react-reflux-todo)
2. [react-client](https://github.com/logzh/react-client)
3. webpack 常用配置文章 (未完成)
4. reflux 使用文章 (未完成)

####方案二：vuejs、ploymer等

[vue-strap](http://yuche.github.io/vue-strap/)
[vue-antd](https://github.com/okoala/vue-antd)
[googlewebcomponents](https://googlewebcomponents.github.io/)

##后台管理系统前台推荐方案

angularjs

demo:

1. [angularjs+webpack](https://github.com/logzh/angular-webpack-example) [使用webpack组织Angularjs代码](http://km.oa.com/group/24792/articles/show/242455)

##问题

1. 前后台分离程度
2. 纯前端项目？ php吐页面？
2. css重构问题
3. 测试问题、安全问题
