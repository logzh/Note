# 123

## HTTP
### HTTP 请求和响应常见字段
```
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Encoding:gzip, deflate, sdch
Accept-Language:zh-CN,zh;q=0.8,en;q=0.6
Cache-Control:max-age=0
Connection:keep-alive
Cookie:ptui_loginuin=1695574055; tvfe_boss_uuid=c0bc3506c6e13e11; o_cookie=285636552; pac_uid=1_285636552; eas_sid=C1E438812551v4z2C1Z0Q8K284; gaduid=584e56cad418f; _qddaz=QD.2d9x9v.ff5e1i.iw4g99xn; TIG_SESSION=b5q92nkprc5mv92k03cafjq3n5; pt2gguin=o0285636552; uin=o0285636552; skey=@ztLItXcn4; ptisp=ctc; RK=qMNKGpHiE/; ptcz=e92656fa67adfe985380a2cc73a78069be2dfcb194ae5933fa427bc78ef18384; pgv_info=ssid=s8465510784; ts_last=wwq.qq.com/activity/1.html; pgv_pvid=6647345412; ts_uid=8115608976; PHPSESSID=o2hdlc1min9e8p1he37tnlis30
DNT:1
Host:wwq.qq.com
If-Modified-Since:Tue, 22 Nov 2016 06:25:43 GMT
If-None-Match:"5833e4e7-807"
Referer:http://wwq.qq.com/bbs
Upgrade-Insecure-Requests:1
User-Agent:Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1
```

```
Access-Control-Allow-Origin:http://open.weixin.qq.com
Cache-Control:max-age=31536000
Connection:keep-alive
Content-Encoding:gzip
Content-Length:3243
Content-Type:application/x-javascript
Date:Tue, 13 Dec 2016 05:22:20 GMT
Expires:Wed, 13 Dec 2017 05:22:20 GMT
Last-Modified:Mon, 12 Dec 2016 12:40:00 GMT
Server:NWS_UGC_HY
X-Cache-Lookup:Hit From Disktank Gz
```
```
Connection:keep-alive
Date:Tue, 13 Dec 2016 05:22:15 GMT
ETag:"5833e4e7-807"
Last-Modified:Tue, 22 Nov 2016 06:25:43 GMT
Server:nginx/1.8.0
X-FROM-SERVER:10.129.*.162
```
```
Accept-Ranges:bytes
Connection:keep-alive
Content-Length:2055
Content-Type:text/html
Date:Tue, 13 Dec 2016 05:25:38 GMT
ETag:"5833e4e7-807"
Last-Modified:Tue, 22 Nov 2016 06:25:43 GMT
Server:nginx/1.8.0
X-FROM-SERVER:10.129.*.162
```
### Etag,If-None-Match
 权威指南 p189
 
### 服务端对 Cache-Control 可以做什么

## 前端

### react 与 angular 的渲染机制

### 闭包 
> 参考文章：[学习Javascript闭包（Closure）学习Javascript闭包（Closure）](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
### 作用域

### 原型机制

### var 和 let 的区别 

### es6 中 generator

### local-storage 和 cookie 区别

### jsonp

### 跨域问题：怎么解决跨域问题
怎么算跨域？协议，域名，端口都必须相同，才算在同一个域。

怎么解决？
- Nginx 反向代理
- CORS（Cross Origin Resource Sharing 跨域资源共享）：需要考虑浏览器兼容性
- JSONP
- 中间层转发

CORS 涉及的响应头：
- Access-Control-Allow-Origin 允许访问的客户端域名：指定一个具体的域名或者一个星形标示号表示允许所有的域
- Access-Control-Allow-Methods
- Access-Control-Allow-Credentials
- Access-Control-Max-Age
- Access-Control-Allow-Headers

## DB 

### MySql 常见的引擎 

> 最常见的两种： MyISAM 和 InnoDB。区别略。

### 索引，多个索引 

> 
- 执行查询时，MySQL只能使用一个索引，会从多个索引中选择一个限制最为严格的索引。
- 最左前缀是什么

### 拆表

分库分表

- 垂直拆分：对表的列进行拆分，把一张列比较多的表拆分为多张表
  - 把不常用的字段单独放在一张表。
  - 把text，blob等大字段拆分出来放在附表中。
  - 经常组合查询的列放在一张表中。
- 水平拆分：对表的行进行拆分，按照一定的策略对表按行拆分，例如
  - 时间
  - 取模
  - ...

## 缓存

### memcached 是什么鬼

### redis 和 memcached 的区别和选型

### redis 挂了，会怎么样

### reids 设置 key 多久过期
- EXPIRE、PEXPIRE 
- EXPIREAT、PEXPIREAT

## php

### php,php-fpm,cgi,fast-cgi,nginx 之间的关系

### 到达 index.php 之前做了什么
