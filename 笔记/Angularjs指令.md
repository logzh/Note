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

