# 组件间通信

## For parent-child communication:父 => 子 通信 

> For parent-child communication, simply pass props.

这种情况很简单，就是父组件设置子组件的props，实现给子组件传递参数，完成通信。

React组件编写规则中也强调的是：组件的 props 由外面的 JSX （其实就是父组件）熟悉传入，永远只读，不做修改，主要用于数据的展示、以及父组件向子组件的传递数据。

## For child-parent communication:子 => 父 通信

主要通过父组件给子组件设置回调函数，子组件通过该回调函数实现向父组件传递参数的目的，完成通信。 

```
var GroceryList = React.createClass({
  handleClick: function(i) {
    console.log('You clicked: ' + this.props.items[i]);
  },

  render: function() {
    return (
      <div>
        {this.props.items.map(function(item, i) {
          return (
            <div onClick={this.handleClick.bind(this, i)} key={i}>{item}</div>
          );
        }, this)}
      </div>
    );
  }
});

ReactDOM.render(
  <GroceryList items={['Apple', 'Banana', 'Cranberry']} />, mountNode
);
```

```
var GroceryList2 = React.createClass({
  handleClick: function(item){
    console.log(item)
  },
  render: function() {
    var props = this.props;
    var self = this;

    var createItem = function(item, index){
      return  <div key={index}  onClick={self.handleClick.bind(null, item)} >{item}</div>
    };

    return (
        <div>
          {props.items.map(createItem)}
        </div>
    );
  }
});

ReactDOM.render(
    <GroceryList2 items={['Apple', 'Banana', 'Cranberry']} />,
    document.body.appendChild(document.createElement('div'))
);
```
##For communication between two components that don't have a parent-child relationship 非父子组件

> you can set up your own global event system. Subscribe to events in `componentDidMount()`, unsubscribe in `componentWillUnmount()`, and call `setState()` when you receive an event. Flux pattern is one of the possible ways to arrange this.

使用全局的事件 Pub/Sub 模式，在 `componentDidMount()` 方法中监听事件， `componentWillUnmount()`方法中移除监听，如果监听到事件变化则调用 `setState()`更新 UI。这种方式在复杂的系统中将使应用变得杂乱无序，难易维护。
这时候就需要 Flux 或者 类似Flux 的单向数据流(unidirectional data flow)框架。

```
...
  getInitialState: function() {
    return store.getAll();
  },
  componentDidMount: function() {
    store.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    store.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(store.getAll());
  },
  ...
 ```

参考：[官方文档](http://facebook.github.io/react/tips/communicate-between-components.html)