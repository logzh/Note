#React 入门总结（JSX与组件）

##React 的第一印象（编写的代码是什么样子）

开发代码

*demo.html*
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```

开发代码将 JSX 转换后，上线的代码：

*helloworld.js*
```
ReactDOM.render(
  React.createElement('h1', null, 'Hello, world!'),
  document.getElementById('example')
);
```
*demo.html*
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <!-- No need for Babel! -->
  </head>
  <body>
    <div id="example"></div>
    <script src="build/helloworld.js"></script>
  </body>
</html>
```

##React是什么

React 是一个 UI 库，具体说 React 是<strong>做 UI 组件</strong>的 JavaScript 库，也就是用 JS 写前端UI。不同于 Angular 是一个完整的框架，React 仅仅只是 VIEW 层。
官方定义：A Javascript Library For Building User Interfaces 。

hello 组件
```
var Hello = React.createClass({
    render: function() {
        return <div>Hello {this.props.name}</div>;
    }
});
 
ReactDom.render(<Hello name="World" />, document.getElementById('container'));
```

Timer 组件

```
var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
    );
  }
});

ReactDom.render(<Timer />, document.getElementById('container'));
```

Timer 组件结合 webpack 的使用

*Hello.jsx*定义组件
```
var React = require('react');

var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
    );
  }
});

module.exports = Timer;
```
*index.js*使用组件
```
var React = require('react');
var ReactDom = require('react-dom');
var Timer = require('Timer');

ReactDom.render(<Timer />, document.getElementById('container'));
```

##优势
- api 少，类库易学
  - [Top-Level API](http://facebook.github.io/react/docs/top-level-api.html)
  - [Component API](http://facebook.github.io/react/docs/component-api.html)
  - [Component Specs and Lifecycle](http://facebook.github.io/react/docs/component-specs.html)
- 组件内聚，易于组合
- 原生组件和自定义组件融合渲染
- 状态/属性驱动全局更新，不用关注细节更新
  - props
  - state 
- commonjs 生态圈/工具链完善（webpack）
  - webpack

##一些概念
* JSX （可选的）
* 组件
* Virtual Dom
* Data Flow 单向数据绑定

这是 react 四个主要的知识点。本文只简单介绍总结 JSX 和组件。

##JSX

JSX 语法是类似 Html 的xml格式。注意和 Html 语法不太一样，比如必须是驼峰命名，以及属性名不能和 JS 关键字冲突，例如：className，readOnly。

一、 JSX 是可选的

使用 JSX
```
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

ReactDOM.render(<HelloMessage name="John" />, mountNode);
```

不使用 JSX
```
"use strict";

var HelloMessage = React.createClass({
  displayName: "HelloMessage",

  render: function render() {
    return React.createElement(
      "div",
      null,
      "Hello ",
      this.props.name
    );
  }
});

ReactDOM.render(React.createElement(HelloMessage, { name: "John" }), mountNode);
```

二、 JSX 嵌入变量

可以通过 {变量名} 来将变量的值作为属性值

```
var HelloMessage = React.createClass({
  render: function() {
    return <div>name: {this.props.name}, age: {this.props.age}</div>;
  }
});

var user = {"name":"jack", age:29};
ReactDOM.render(<User user={user} />, mountNode);
```

三、 JSX 熟悉扩散，[JSX Spread Attributes](http://facebook.github.io/react/docs/jsx-spread.html)

可以用通过 {...obj} 来批量设置一个对象的键值对到组件的属性，注意顺序,因为熟悉可以被覆盖

```
var HelloMessage = React.createClass({
  render: function() {
    return <div>name: {this.props.name}, age: {this.props.age}</div>;
  }
});

var user = {"name":"jack", age:29};
ReactDOM.render(<User {...user} name="override name"/>, mountNode);
```

四、 属性值可以使用 Javascript 表达式

```
return (
  <nav>
    <Home />
    {loggedIn ? <LogoutButton /> : <LoginButton />}
  </nav>
);

```

五、 需要自闭组件（标签）[Self-Closing Tag](https://facebook.github.io/react/tips/self-closing-tag.html)

组件（标签）需要闭合。

```
var HelloMessage = React.createClass({
  render: function() {
    return (
      <div>
           <MyComponent /> //valid
           <MyComponent >  //invalid
           <img src="#" /> //valid
           <img src="#" > //invalid
      </div>
    );
  }
});
```

六、 一个组件只能返回一个跟节点 [Maximum Number of JSX Root Nodes](http://facebook.github.io/react/tips/maximum-number-of-jsx-root-nodes.html)

组件的render函数只能返回一个根节点，如果包含多个子组件，需要使用div或者span或者其他组件包裹。
```
//valid

var HelloMessage = React.createClass({
  render: function() {
    return (
      <div>
           <MyComponent /> 
           <img src="#" />
      </div>
    );
  }
});

//invalid

var HelloMessage = React.createClass({
  render: function() {
    return (
      <MyComponent /> 
      <img src="#" />
    );
  }
});
```

七、[JSX中的 false](http://facebook.github.io/react/tips/false-in-jsx.html)

常见的三种场景

- 1、Renders as id="false":

```
ReactDOM.render(<div id={false} />, mountNode);
```

- 2、String "false" as input value:

```
ReactDOM.render(<input value={false} />, mountNode);
```

- 3、No child:

```
ReactDOM.render(<div>{false}</div>, mountNode);
```

这里不会渲染成字符串 false 作为div的子组件。这种做法类似我们常见的一种用法：

```
<div>{x > 1 && 'You have more than one item'}</div>
```

## 组件
组件有两个核心的概念：
* props 属性，由外面的 JSX 熟悉传入，*永远是只读的*，之后建议不要修改。主要用于数据的展示、父子组件的数据传递。
* state 状态，组件可以理解为一个状态机，fn(state)=>UI。一旦状态发生改变，组件会自动 render 方法重新渲染UI。

开发组件时，应该让状态尽可能的少，但能完全表达整个UI，这样组件逻辑就容易维护。

无状态组件（stateless function）: 使用纯粹的函数可以定义无状态的组件。这种组件只是简单的从外面接受 props 渲染 DOM。

```
var React = require('react');
require('../css/gotop.css');

//Stateless functional components

var Top = function () {
    return (
        <div className="back-top">
            <a className="code">
                <div className="code-box"><i></i><img src="http://cdn.tig.qq.com/images/wwq_wx_qrcode.jpg" alt="玩物圈微信二维码"/></div>
            </a>
            <a href="#top" className="top"></a>
        </div>
    );
};

module.exports = Top;
```

通常的做法是：一个顶级父组件为中包括状态和逻辑，通过props传递数据给各个子组件，而子组件是没有状态的，子组件只关注数据的渲染。
[参考](http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html#what-components-should-have-state)

> Most of your components should simply take some data from props and render it. However, sometimes you need to respond to user input, a server request or the passage of time. For this you use state.

> Try to keep as many of your components as possible stateless. By doing this you'll isolate the state to its most logical place and minimize redundancy, making it easier to reason about your application.

> A common pattern is to create several stateless components that just render data, and have a stateful component above them in the hierarchy that passes its state to its children via props. The stateful component encapsulates all of the interaction logic, while the stateless components take care of rendering data in a declarative way.

<strong>这种做法在 *redux*（单向数据流 Flux 模式的一种实现）中显得很明显。</strong>

参考文档：
- [官方文档](http://facebook.github.io/react/docs/getting-started.html)
- [React 入门教程](https://hulufei.gitbooks.io/react-tutorial/content/introduction.html)
 