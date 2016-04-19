## 最简单的demo使用

## MVC 模式

M

V

C

- 作用域 $scope
- 作用域层级与继承
- 作用域与事件系统

## 视图

- 数据驱动视图
- 声明式 UI 结构

不要去操作 Dom 元素

## 模块与依赖注入

- 为什么要使用模块？
- 我们需要使用其他的协作模块怎么办？

```
var myMod = angular.module('myMod', []);
```
如果不使用模块，那只能使用全局的控制器方式。污染全局变量，难以管理、维护、组织、复用代码。
模块化可以解决这些问题，它带来了命名空间和组织代码，复用代码等。

依赖注入解决模块之间的协作问题。

- 模块上注册定义服务
  - 值 ```myMod.value(```
  - 服务
    - *myMod.service(*
    - *myMod.factory(*
    - *myMod.provider(*
    - myMode.constant(