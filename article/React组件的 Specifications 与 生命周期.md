#组件Specifications方法

当使用 React.createClass() 创建一个组件时，我们需要需要提供一个特殊对象参数给 React.createClass() 。这个对象需要包括一个 render 方法（必须）以及其他一些表示组件各个生命周期的方法。

###getDefaultProps 
```
object getDefaultProps()
```
> Invoked once and cached when the <strong>class is created</strong>. Values in the mapping will be set on this.props if that prop is not specified by the parent component (i.e. using an in check).

> This method is invoked before any instances are created and thus cannot rely on this.props. In addition, be aware that any complex objects returned by getDefaultProps() will be shared across instances, not copied.

这个方法只会在组件类创建时调用一次，其返回的对象可以用于设置默认的 props 值。
```
var Hello = React.creatClass({
    getDefaultProps: function(){
        return {
            name: 'world'
        }
    },
    render: function(){
        return (
            <div>Hello,{this.props.name}</div>
        )
    }
});

ReactDOM.render(<Hello />, document.body);//使用默认的 props
```

```
<Hello name="hh" />//使用指定的的 props
```

[参考ES6编写组件](http://facebook.github.io/react/docs/reusable-components.html#es6-classes)，值得注意的是， props 会在所有实例中共享，而不是每个组件实例拥有单独的副本。这也是它与 state 的区别！
```
export class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  tick() {
    this.setState({count: this.state.count + 1});
  }
  render() {
    return (
      <div onClick={this.tick.bind(this)}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };
```
所以不要在组件实例中去修改 props，<strong>记住props永远只读就好</strong>。

###PropTypes

React 通过 propTypes 提供了一种验证 props 的方式，propTypes 是一个配置对象，用于定义属性类型，以及属性是否 required。

[参考官方文档](http://facebook.github.io/react/docs/reusable-components.html)
```
React.createClass({
  propTypes: {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
    optionalArray: React.PropTypes.array,
    optionalBool: React.PropTypes.bool,
    optionalFunc: React.PropTypes.func,
    optionalNumber: React.PropTypes.number,
    optionalObject: React.PropTypes.object,
    optionalString: React.PropTypes.string,

    // Anything that can be rendered: numbers, strings, elements or an array
    // (or fragment) containing these types.
    optionalNode: React.PropTypes.node,

    // A React element.
    optionalElement: React.PropTypes.element,

    // You can also declare that a prop is an instance of a class. This uses
    // JS's instanceof operator.
    optionalMessage: React.PropTypes.instanceOf(Message),

    // You can ensure that your prop is limited to specific values by treating
    // it as an enum.
    optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

    // An object that could be one of many types
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message)
    ]),

    // An array of a certain type
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

    // An object with property values of a certain type
    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

    // An object taking on a particular shape
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: React.PropTypes.number
    }),

    // You can chain any of the above with `isRequired` to make sure a warning
    // is shown if the prop isn't provided.
    requiredFunc: React.PropTypes.func.isRequired,

    // A value of any data type
    requiredAny: React.PropTypes.any.isRequired,

    // You can also specify a custom validator. It should return an Error
    // object if the validation fails. Don't `console.warn` or throw, as this
    // won't work inside `oneOfType`.
    customProp: function(props, propName, componentName) {
      if (!/matchme/.test(props[propName])) {
        return new Error('Validation failed!');
      }
    }
  },
  /* ... */
});
```
###getInitialState

```
object getInitialState()
```

> Invoked once before the component is mounted. The return value will be used as the initial value of this.state.

对于组件的每个实例来说，这个方法的调用有且只有一次，用来初始化每个实例的 state，在这个方法里，[可以访问组件的 props](https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html)。
每一个React组件都有自己的 state，其与 props 的区别在于 state只存在组件的内部，props 在所有实例中共享。

getInitialState 和 getDefaultPops 的调用是有区别的，getDefaultPops 是对于组件类来说只调用一次（Invoked once and cached when the <strong>class is created</strong>.），后续该类的应用都不会被调用，而 getInitialState 是对于每个组件实例来讲都会调用，并且只调一次。

```
var LikeButton = React.createClass({
  getDefaultProps: function() {
    return { liked:false }
  },
  getInitialState: function() {
    return {liked: this.props.liked};
  },
  handleClick: function(event) {
    this.setState({liked: !this.state.liked});
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
        <p onClick={this.handleClick}>
          You {text} this. Click to toggle.
        </p>
    );
  }
});
ReactDOM.render(
    <LikeButton />,
    document.getElementById('example')
);
```
每次修改 state（通过 this.setState 方法来修改），都会重新渲染组件，实例化后通过 state 更新组件，会依次调用下列方法：

- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

如果 shouldComponentUpdate 返回 false 则不会调用其他方法。

###render

```
ReactElement render()
```

> The render() method is required.

> When called, it should examine this.props and this.state and return a single child element. This child element can be either a virtual representation of a native DOM component (such as `<div />` or React.DOM.div()) or another composite component that you've defined yourself.

> You can also return null or false to indicate that you don't want anything rendered. Behind the scenes, React renders a `<noscript>` tag to work with our current diffing algorithm. When returning null or false, ReactDOM.findDOMNode(this) will return null.

> The render() function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, and it does not read from or write to the DOM or otherwise interact with the browser (e.g., by using setTimeout). If you need to interact with the browser, perform your work in componentDidMount() or the other lifecycle methods instead. Keeping render() pure makes server rendering more practical and makes components easier to think about.

render方法是组件唯一一个必需的方法。render方法会创建一个虚拟DOM，用来表示组件的输出。使用render方法需要注意：

- 只能通过 this.props 和 this.state 访问数据
- 可以返回 null,false 或者任何React单个组件
- 只能出现一个顶级组件，不能返回一组元素
- 不能改变组件的状态
- 不能修改DOM的输出

###mixins
```
array mixins
```
[参考](https://facebook.github.io/react/docs/reusable-components.html#mixins)
```

```
#组件生命周期方法

组件的生命周期分成三个状态：

- Mounting：已插入真实 DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实 DOM

React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数。

- componentWillMount()
- componentDidMount()
- componentWillUpdate(object nextProps, object nextState)
- componentDidUpdate(object prevProps, object prevState)
- componentWillUnmount()

此外，React 还提供两种特殊状态的处理函数。使用这两个函数时，组件处于Updating生存状态。

- componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
- shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用

##Mounting 装载期

###componentWillMount 
```
void componentWillMount()
```

> Invoked once, both on the client and server, immediately before the initial rendering occurs. If you call setState within this method, render() will see the updated state and will be executed only once despite the state change.

该方法在首次渲染之前调用，也是再 render 方法调用之前修改 state 的最后一次机会。


###componentDidMount
```
void componentDidMount()
```

> Invoked once, only on the client (not on the server), immediately after the initial rendering occurs. At this point in the lifecycle, you can access any refs to your children (e.g., to access the underlying DOM representation). The componentDidMount() method of child components is invoked before that of parent components.

> If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, or send AJAX requests, perform those operations in this method.

该方法只会在客户端渲染时被调用，不会在服务端被渲染的过程中调用。
该方法被调用时，组件已经渲染出了真实的 DOM，可以在该方法中通过 this.getDOMNode() 访问到真实的 DOM。当然往往不需要获取操作 DOM。

```
var App = React.createClass({
    conponentDidMount: function(){
        //this.getDOMNode();//可以通过 this.getDOMNode() 来获取真实的 DOM 节点
        this.refs.theInput.focus(); //可以使用该组件及其子组件的 refs
        $.ajax(...)//可以发送ajax请求等
        $(ReactDOM.findDOMNode(this.refs.placeholder)).append($('<span />'));//使用第三方js库
    },
    render: function(){
        return <input ref="theInput" .. />
    }
})
```

##Updating 生存期

此时组件已经渲染好。并且用户可以与它进行交互，导致应用状态的改变，你将会看到下面的方法依次被调用

- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

###componentWillReceiveProps 
```
void componentWillReceiveProps(
  object nextProps
)
```
> Invoked when a component is receiving new props. This method is not called for the initial render.

> Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState(). The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.

组件的 props 一般是通过父组件来修改的，这时候 componentWillReceiveProps 将被调用。可以在这个方法里更新 state，以触发 render 方法重新渲染组件。

```
componentWillReceiveProps: function(nextProps) {
  this.setState({
    likesIncreasing: nextProps.likeCount > this.props.likeCount
  });
}
```

> 值得注意的是，没有类似的componentWillReceiveState方法。props 的变化可能会引起 state 做出调整，反之则不成立。
> 如果需要在 state 改变前做一些操作，应该使用方法 componentWillUpdate。

###shouldComponentUpdate
```
boolean shouldComponentUpdate(
  object nextProps, object nextState
)
```

> Invoked before rendering when new props or state are being received. This method is not called for the initial render or when forceUpdate is used.

> Use this as an opportunity to return false when you're certain that the transition to the new props and state will not require a component update. 

> If shouldComponentUpdate returns false, then render() will be completely skipped until the next state change. In addition, componentWillUpdate and componentDidUpdate will not be called.

> By default, shouldComponentUpdate always returns true to prevent subtle bugs when state is mutated in place, but if you are careful to always treat state as <strong>immutable</strong> and to read only from props and state in render() then you can override shouldComponentUpdate with an implementation that compares the old props and state to their replacements.

> If performance is a bottleneck, especially with dozens or hundreds of components, use shouldComponentUpdate to speed up your app.

当确定组件的 props 或者 state 的改变不需要引起组件重新渲染时，可以通过在这个方法里通过返回 false 来阻止组件的重新渲染。
返回 false 则不会执行 render 以及之后的 componentWillUpdate，componentDidUpdate 方法。

该方法是非必须的，一般不会使用。

在[高级性能优化](https://facebook.github.io/react/docs/advanced-performance.html#shouldcomponentupdate-in-action)中结合 [Immutable.js](http://facebook.github.io/immutable-js/) 使用。

如果组件 state 和 props 是不可变对象，则可直接进行比较，决定组件需不需要渲染，以达到性能优化的目的。

```
shouldComponentUpdate: function(nextProps, nextState) {
  return nextProps.id !== this.props.id;
  //return false;//返回false 则不会重新渲染组件
}
```
###componentWillUpdate

```
void componentWillUpdate(
  object nextProps, object nextState
)
```

> Invoked immediately before rendering when new props or state are being received. This method is not called for the initial render.

> Use this as an opportunity to perform preparation before an update occurs.

> You cannot use this.setState() in this method. If you need to update state in response to a prop change, use componentWillReceiveProps instead.

这个方法和 componentWillMount 类似，在组件接收到了新的 props 或者 state 即将进行重新渲染前，该方法会被调用。

> 注意不要在该方法中使用 this.setState() 修改组件的状态。如果 props 改变需要引起 state 变化，请使用 componentWillReceiveProps 方法。

###componentDidUpdate

```
void componentDidUpdate(
  object prevProps, object prevState
)
```
> Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.

> Use this as an opportunity to operate on the DOM when the component has been updated.

这个方法和 componentDidMount 类似，在组件重新被渲染之后，该方法会被立即调用。可以在该方法中访问并操作 DOM。

##Unmounting，销毁卸载时

###componentWillUnmount

```
void componentWillUnmount()
```

> Invoked immediately before a component is unmounted from the DOM.

> Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.

当一个组件需要从 DOM 中卸载销毁时调用。该方法的主要作用是完成必要的清理作用。比如清理 conponentDidMount 方法中创建的定时器或事件监听器。

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

主要参考：[React官方文档](http://facebook.github.io/react/docs/component-specs.html)