# 一、Angularjs 概括

## 1、双向绑定（第一印象）

```
<!DOCTYPE html>
<html ng-app>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>双向绑定（第一印象）</title>
  <script src="http://cdn.tig.qq.com/js/lib/angular-1.3.15.min.js"></script>
</head>
<body>
  <input type="text" ng-model="msg">
  {{msg}}
</body>
</html>
```

## 2、MVC 模式

M

V

- 数据模型变化驱动视图视图
- 声明式 UI 结构

C

- 作用域 $scope
- 作用域层级与继承
- 作用域与事件系统

## 3、模块与依赖注入

### 定义
```
var myMod = angular.module('myMod', []);
```
- 为什么要使用模块？
- 我们需要使用其他的协作模块怎么办？

简单回答开始的两个问题：

问题一：如果不使用模块，那只能使用全局的控制器方式。污染全局变量，难以管理、维护、组织、复用代码。
模块化可以解决这些问题，它带来了命名空间和组织代码，复用代码等。

问题二：依赖注入解决模块之间的协作问题。

低级版本Angular中使用controller不需要在模块中注册

```
<!DOCTYPE html>
<html ng-app>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>低级版本Angular中使用controller不需要模块</title>
  <script src="http://code.angularjs.org/angular-1.0.1.min.js"></script>
</head>
<body>
  <p>低级版本Angular中使用controller不需要模块</p>
  <div ng-controller="HelloCtrl">
    <input type="text" ng-model="data.msg"> {{data.msg}}
  </div>
  <script type="text/javascript">
    var HelloCtrl = function($scope) {
     $scope.data = {msg:123};
  }
  </script>
</body>
</html>
```
之后控制器的需要在模块上注册
```
<!DOCTYPE html>
<html ng-app="myMod">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>模块上注册控制器</title>
  <script src="http://cdn.tig.qq.com/js/lib/angular-1.3.15.min.js"></script>
</head>
<body>
  <div ng-controller="helloCtrl">
    <input type="text" ng-model="msg"> {{msg}}
  </div>
  <script type="text/javascript">
    var myMod = angular.module('myMod', []);
    myMod.controller('helloCtrl', function($scope) {
     $scope.msg = "msg";
    });
  </script>
</body>
</html>
```

### 模块上注册控制器

```
var myMod = angular.module('myMod', []);
myMod.controller('helloCtrl', function($scope) {
  $scope.msg = "msg";
});
```

### 模块上注册定义服务

- 值 ```myMod.value(...)```
- 服务
  - ```myMod.service(...)```
  - ```myMod.factory(...)```
  - ```myMod.provider(...)```
  - ```myMode.constant(...)```
  
除了 constant，其他都是 provider 的封装。

### 模块的生命周期
- 配置阶段：收集对象创建的解决方案，并进行配置。 ```myMod.config(...)```
- 运行阶段：执行所有初始化后的逻辑。```myMod.run(...)```

不同的阶段与不同的注册方法。

- 配置阶段可以注入：常量值、Provider
- 运行阶段可以注入：常量值、变量值、Service、Factory

### 模块依赖
```
var myMod = angular.module('myMod', ['myMod2', 'myMod3']);
```
服务的跨模块可见性

兄弟模块之间可以相互使用服务，也可以覆盖兄弟的服务。

## 4、指令

### 定义

```
myModule.directive('myDir', function(){
    return myDirDefine;
});
```

myDirDefine 是个对象，有几个基本的属性：

- name 指令名称
- restrict 指令存在形式A（属性attribute）、E（element）、C（class）、M（comment），常见的是 A 和 E
- templte 指令模版字符串
- templateUrl  指令模版的URL路径
- replace 是否使用模版内容替换指令现有的元素
- tansclude 是否为指令模版和编译函数提供*指令元素中的内容*。vue.js中 称之为 slot（插槽）

- scope 作用域
- controller 指令控制器函数，*作用：对外提供接口*
- require 设置需要注入的指令，也就是需要依赖的指令
- link 链接函数：处理指令内部事务，比如 Dom 操作等
- compile 编译函数

### 指令与控制器的交互

- 在指令上定义属性与外部的控制器进行交互

例子1：

项目中使用（AngularUI 中翻页指令的使用）：

*uib-pagination* 翻页指令和外部控制器的 方法 *pageChanged(e)* 需要进行交互

```
<uib-pagination total-items="groups.total" ng-model="currentPage" class="pagination-sm" ng-change="pageChanged(e)"></uib-pagination>
```

#### 例子2：

参考：大漠穷秋的学习视频 [《AngularJS实战》](http://www.imooc.com/learn/156 )

在指令 *loader* 上定义属性 howToLoad，与外部控制器交互

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>JS Bin</title>
    <script src="http://cdn.tig.qq.com/js/lib/angular-1.3.15.min.js"></script>
</head>
<style>
    .loader{
        background-color: blue;
        padding-top:5px
    }
</style>
<body>
    <div ng-controller="helloCtrl">
        <input type="text" ng-model="msg"> {{msg}}
    </div>
    <div ng-controller="helloCtrl1">
        <loader howToLoad="loadData1()"></loader>
    </div>
    <div>
        <p>ddd</p>
    </div>
    <div ng-controller="helloCtrl2">
        <loader howToLoad="loadData2()"></loader>
    </div>
    <script type="text/javascript">
        var myModule = angular.module('myModule', []);
        myModule.controller('helloCtrl', function($scope) {
            $scope.msg = "hahaha";
        });
        
         myModule.controller('helloCtrl1', function($scope) {
            $scope.loadData1 = function(){
                console.log('加载数据1');
            };
        });
        
         myModule.controller('helloCtrl2', function($scope) {
            $scope.loadData2 = function(){
                console.log('加载数据2');
            };
        });
        
        myModule.directive('loader', function(){
            return {
                restrict:'E',
                template:'<div class="loader">加载数据指令</div>',
                link: function(scope, element, attr){
                    element.bind('mouseenter', function(){
                        scope.$apply(attr.howtoload);
                    })
                }
            };
        });
        angular.bootstrap(document, ['myModule']);
    </script>
</body>
</html>
```

### 指令与指令之间的交互

- 指令的controller 为指令对外暴露一组public方法，提供给其他指令调用
- require 设置依赖的指令
- link 函数中第四个参数，将得到依赖指令的控制器

#### 例子1：

我们经常会看到很多指令编写会依赖 *ng-model* 指令，例如下面的指令

```
myMod.directive('phoneNo', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if (!ngModelCtrl) return;

      function validPhoneNo(value) {
        var PHONE_NO_REGEXP = /^1[3|4|5|8][0-9]\d{8}$/;
        var valid = !ngModelCtrl.$isEmpty(value) && PHONE_NO_REGEXP.test(value);
        ngModelCtrl.$setValidity('valid', valid);

        return valid ? value : undefined;
      }

      ngModelCtrl.$parsers.unshift(validPhoneNo);
      ngModelCtrl.$formatters.unshift(validPhoneNo);
    }
  };
});
```
使用指令：

```
<input phone-no type="tel" placeholder="填写11位有效手机号码" ng-model="address.phoneNo" required>
```

当然可以更简单的使用官方的 *ng-pattern* 指令

```
<input type="tel" ng-pattern="/^1[3|4|5|8][0-9]\d{8}$/" placeholder="填写11位有效手机号码" ng-model="address.phoneNo" required>
```

#### 例子2：

参考：大漠穷秋的学习视频 [《AngularJS实战》](http://www.imooc.com/learn/156 )

指令 *player* 在自己的控制器上定义了对外可以调用的接口
指令 *power*、指令 *speed*、指令 *height* 分别都定义了需要依赖 指令 *player*、并且在自身的 link 函数中使用了 *player* 的接口。

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>JS Bin</title>
    <script src="http://cdn.tig.qq.com/js/lib/angular-1.3.15.min.js"></script>
</head>
<style>
    .loader{
        background-color: blue;
        padding-top:5px
    }
</style>
<body>
    <div ng-controller="helloCtrl">
        <input type="text" ng-model="msg"> {{msg}}
        <div>
            <player power>球员1 ：力量</player>
        </div>
        <div>
            <player power speed>球员2：力量 + 速度</player>
        </div>
        <div>
            <player power speed height>球员3： 力量 + 速度 + 身高</player>
        </div>
    </div>
    
    <script type="text/javascript">
        var myModule = angular.module('myModule', []);
        myModule.controller('helloCtrl', function($scope) {
            $scope.msg = "hahaha";
        });
        
        myModule.directive('player', function(){
            return {
                restrict:'AE',
                scope:{},
                controller:function($scope){
                    $scope.ability = [];
                    this.addPower = function(){
                       $scope.ability.push('power'); 
                    };
                    
                    this.addSpeed = function(){
                       $scope.ability.push('speed'); 
                    };
                    
                    this.addHeight = function(){
                       $scope.ability.push('height'); 
                    };
                },
                link: function(scope, element, attr){
                    element.bind('mouseenter', function(){
                        console.log(scope.ability);
                    })
                }
            };
        });
        
        myModule.directive('power', function(){
            return {
                restrict:'A',
                require: '^player',
                link: function(scope, element, attr, controller){
                    controller.addPower()
                };
            };
        });
        
        myModule.directive('speed', function(){
            return {
                restrict:'A',
                require: '^player',
                link: function(scope, element, attr, controller){
                    controller.addSpeed()
                };
            };
        });
        
        myModule.directive('height', function(){
            return {
                restrict:'A',
                require: '^player',
                link: function(scope, element, attr, controller){
                    controller.addHeight()
                };
            };
        });
      
        angular.bootstrap(document, ['myModule']);
    </script>
</body>

</html>
```

### 理解 scope

scope 的取值

- false 默认是false，复用组件具体位置所在的作用域
- true  创建子作用域，该作用域继承来自它具体所在位置的作用域
- {...} 创建独立作用域，与父作用域完全隔离

实际开发中往往我们会创建独立作用域，完成与父作用域隔离。

可以通过监视来是属性表达式与模版作用域的属性保持一致，但需要手动设置来实现（在link中显示的从attr中读取值，并赋值给scope）。
更方便的是使用scope的绑定策略。

- @：使用@将属性作为字符串传递给指令（例子中的str），也可以将外层的scope值在属性值中以{{}}插入（例子中的str2）
- =：与外部的属性进行双向绑定
- &：传递外部的一个回调函数

```
scope:{
    attr1:'@attribute1', 
    attr2:'=attribute2',
    attr3:'&attribute3'
}
```

首先这里的 scope 是独立作用域，关于绑定策略需要 *注意* 两点：
 - 属性命名使用 - 连接，变量变现为驼峰式
 - 回调函数传递参数的写法

#### 例子

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>指令的scope</title>
    <script src="http://cdn.tig.qq.com/js/lib/angular-1.3.15.min.js"></script>
</head>
<style>
    .loader{
        background-color: blue;
        padding-top:5px
    }
</style>
<body>

    <div ng-controller="helloCtrl">
        <input type="text" ng-model="msg">
        <input type="text" ng-model="str2">
        <input type="text" ng-model="str">
        <p>以下是指令</p>
        
        <my-directive msg="msg" str="1234" str2={{str2}} click-btn="clickBtn(name)">本身的html</my-directive>
        
    </div>
    
    <script type="text/javascript">
        var myModule = angular.module('myModule', []);
        myModule.controller('helloCtrl', function($scope) {
            $scope.msg = "hahaha";
            $scope.str2 = "使用@传递一个字符串";
            
            $scope.clickBtn = function(name){
                console.log(name);
            }
        });
        
        myModule.directive('myDirective', function(){
            return {
                restrict:'E',
                scope:{
                    msg:'=',
                    str:'@',
                    str2:'@',
                    clickBtn: '&'
                },
                template:'<input type="text" ng-model="msg"><p>{{str}}</p><p>{{str2}}</p><input type="text" ng-model="userName"><button ng-click="clickBtn({name:userName})">Click Me</button>',
                link: function(scope, ele, attr){
                    console.log(scope);
                    console.log(attr);
                }
            };
        })
        angular.bootstrap(document, ['myModule']);
    </script>
</body>

</html>
```

### 可以对比 vue.js 中创建组件、组件通信。

#### 和angular指令指令一样vue.js组件的定义也需要注意到属性命名写法

```
<component-a :msg="msg" hh="来自字面量语法" :click-handle="clickHandle"></component-a>
```

```
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat">

  <!-- content -->
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>

</my-component>
```

#### vue.js 中编写可复用的组件 

组件的 API 来自三部分：props、事件、slot
-props 允许外部环境传递数据给组件（其中数据也可以是 action）
-事件 允许在组件内触发外部环境的 action
-slot 允许外部环境插入内容到组件的视图结构内 （包括指定插入内容在组件中的位置）

### 对比 React

react 也是通过 props 传递。对属性命名没有和Angular、vue这种要求

```
<MiniPost ref="miniPost" onOk={this.sendPost} placeholder={postPlaceholder}/>
```

# 二、后台管理端中Angularjs的实践

## 为什么选择 Angularjs
- Angularjs 适合管理后台类型的项目
- 开发效率高
- 前后端部分解耦

## 怎么使用

一、使用 requirejs 管理我们的js文件（不强求），这一步和 angularjs 没有关系。

```
require.config({
  urlArgs: "v=" + (new Date()).getTime(),// 体验环境和正式环境会替换为构建版本号
  baseUrl: "/js/",
  paths: {
    "jquery": "vendor/jquery-1.11.3.min",
    "underscore": "vendor/underscore.min",
    "moment": "vendor/moment.min",
    "angular": "vendor/angular.min",
    "ui-router": "vendor/angular-ui-router.min",
    "ng-file-upload": "vendor/ng-file-upload",
    "ng-sanitize": "vendor/angular-sanitize.min",
    "ui-bootstrap": "vendor/ui-bootstrap-tpls-0.12.1.min",
    "angular-datetimepicker": "vendor/angular-datetimepicker",
    "ui-select": "vendor/ui-select",
    "checklist-model": "vendor/checklist-model",
    "directives": "vendor/directives",
    "tfl": "tfl/js/tfl-core",
    "tfl-editor": "tfl/js/tfl-editor"
  },
  shim: {
    "angular": {
      exports: "angular"
    },
    "ui-router": {
      deps: ["angular"]
    },
    "ng-file-upload": {
      deps: ["angular"]
    },
    "ng-sanitize": {
      deps: ["angular"]
    },
    "ui-bootstrap": {
      deps: ["angular"]
    },
    "ui-select": {
      deps: ["angular"]
    },
    "checklist-model": {
      deps: ["angular"]
    },
    "angular-datetimepicker": {
      deps: ["angular", "moment"]
    },
    "serviceModule": {
      deps: ["angular"]
    },
    "directives": {
      deps: ["angular", 'tfl']
    }
  }
});

```

二、我们不会整站在根目录下直接使用，而是根据不同业务模块分拆开，这样有*利于代码的维护和组织*，个人认为这点很重要

网站路由 一部分交给后台(/shop/goods)、一部分交给 angular（#/部分）

```
http://demo.com/shop/goods#/
http://demo.com/shop/goods#/detail/100034
http://demo.com/shop/goods#/edit/100034
http://demo.com/shop/goods#/edit/100034
```

demo.com/shop/goods 后台 php 吐出的直出的页面（当然这个的外出有个整站的layout）
```
<div ui-view></div>

<script>
    require(['shop/goods'], function(){
    });
</script>
```

业务 *shop/goods.js*
```
define(['jquery', 'angular', 'ui-router', 'serviceModule'], function($, angular) {

  var myModule = angular.module('myModule', [
    'ui.router', 'serviceModule'
  ]);

  myModule.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
    function($httpProvider, $stateProvider, $urlRouterProvider) {

      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      $httpProvider.defaults.transformRequest = function(data) {
        if (data === undefined) {
          return data;
        }
        return $.param(data);
      };

      $urlRouterProvider.otherwise('/');

      $stateProvider.state('demo', {
        abstract: true,
        url: '/',
        template: '<div ui-view></div>',
        controller: ['$scope', function($scope) {

        }]
      });

      $stateProvider.state('demo.list', {
        url: '',
        pageTitle: 'list页',
        templateUrl: '/views/demo.list.html',
        controller: ['$scope', function($scope) {
        }]
      });

      $stateProvider.state('demo.detail', {
        url: 'detail/{id:[0-9]+}',
        pageTitle: '详情页',
        templateUrl: '/views/demo.detail.html',
        resolve: {
          data: ['$stateParams', 'Test', function($stateParams, Test) {
            return Test.fetch($stateParams.id);
          }]
        },
        controller: ['$scope', 'data', function($scope, data) {
          console.log(12);
          $scope.data = data;
        }]
      });

      $stateProvider.state('demo.add', {
        url: 'add',
        pageTitle: '新增编辑页',
        templateUrl: '/views/demo.add.html',

        controller: ['$scope', function($scope) {
          console.log('add');
        }]
      });
    }]);

  angular.bootstrap(document, ['myModule']);
});
```

*serviceModule.js* 定义一个和后台数据交换的模块 *serviceModule*
```
define(['angular'], function(angular) {
  'use strict';
  var serviceModule = angular.module('serviceModule', []);
  serviceModule.factory('Test', ['$http', function($http) {
    return {
      fetch: function(id) {
        return $http.get('/test/get/' + id).then(function(res) {
          return res.data;
        });
      },
      list: function(search) {
        return $http.get('/test/list', {params: search}).then(function(res) {
          return res.data;
        });
      },
      save: function(data, cb) {
        $http.post('/test/save', data).success(cb);
      }
    };
  }]);
});

```

就这样商品模块就搞定啦。


#### 参考：
- [《精通AngularJS [Mastering Web Application Development with AngularJS]》](http://item.jd.com/11568614.html)
- 大漠穷秋的学习视频 [《AngularJS实战》](http://www.imooc.com/learn/156 )