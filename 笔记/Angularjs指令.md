# 指令

## 指令

```
myModule.directive('myDir', function(){
    return myDirDefine;
});
```
指令定义（myDirDefine）是个对象，几个基本的属性：

- name 指令名称
- restrict 指令存在形式A(属性attribute)、E（element）、C（class）、M（comment），常见的是 A 和 E
- templte 指令模版字符串
- templateUrl  指令模版的URL路径
- replace 是否使用模版内容替换指令现有的元素
- tansclude 是否为指令模版和编译函数提供*指令元素中的内容*。vue.js中 称之为 slot（插槽）


- scope 作用域
- controller 指令控制器函数，作用：对外提供接口
- require 设置需要注入的指令，也就是需要依赖的指令
- link 链接函数：处理指令内部事务，比如 Dom操作等
- compile 编译函数

## 指令与控制器的交互

在指令上定义属性与外部的控制器进行交互

```
<uib-pagination total-items="groups.total" ng-model="currentPage" class="pagination-sm" ng-change="pageChanged(e)"></uib-pagination>
```

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

## 指令与指令之间的交互

controller 为指令对外暴露一组public方法，提供给其他指令调用

require 设置依赖的指令
link 函数中第四个参数，将得到依赖指令的控制器

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

## 理解 scope

scope 取值

- false 默认是false，复用组件具体位置所在的作用域
- true  创建子作用域，该作用域继承来自它具体所在位置的作用域
- {...} 创建独立作用域，与父作用域完全隔离

往往我们会创建独立作用域，完成与父作用域隔离。

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

首先这里的 scope 是独立作用域，关于绑定策略需要注意两点：
 - 属性命名使用 - 连接，变量变现为驼峰式
 - 回调函数传递参数的写法

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

也注意到属性命名写法

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

编写可复用的组件 组件的 API 来自三部分：props、事件、slot

-props 允许外部环境传递数据给组件（其中数据也可以是 action）
-事件 允许在组件内触发外部环境的 action
-slot 允许外部环境插入内容到组件的视图结构内 （包括指定插入内容在组件中的位置）

### 对比 React

react 也是通过 props 传递。对属性命名没有和Angular、vue这种要求