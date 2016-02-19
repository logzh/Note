#理解 react-redux、中间件

- Middleware
- 异步的 Action
- redux 与 react 搭配使用：react-redux

本文主要是对Redux官方中文文档的梳理以及自身在项目中使用对Redux的理解。

##Middleware

middleware 其实就是高阶函数（函数作为参数传入，这样的函数称为高阶函数），作用于 dispatch 返回一个新的 dispatch（附加了该中间件功能）。可以形式化为：newDispatch = middleware1(middleware2(...(dispatch)...))。
```
// thunk-middleware
export default function thunkMiddleware({ dispatch, getState }) {
    return next => action =>
        typeof action === 'function' ? action(dispatch, getState) : next(action)
}
```

通过 thunk-middleware 我们可以看出中间件的一般形式：中间件函数接受两个参数参数： dispatch 和 getState（也就是说中间件可以获取 state 以及 dispatch new action）。中间件一般返回 next(action)（thunk-middleware 比较特殊，它用于 dispatch 执行异步回调的 action）。store 的创建过程如下：

```
const reducer = combineReducers(reducers)
const finalCreateStore = applyMiddleware(promiseMiddleware, warningMiddleware,
    loggerMiddleWare)(createStore)
const store = finalCreateStore(reducer)
```

##异步 Actions

实际应用中页面充斥着大量的异步请求（ajax）。dispatch(action) 是同步的，如果要处理异步 action，需要使用一些中间件。 
redux-thunks 和 redux-promise 分别是使用异步回调和 Promise 来解决异步 action 问题的。我们项目中使用redux-thunks。

##Redux 和传统 Flux 框架的比较




图来自 [UNIDIRECTIONAL USER INTERFACE ARCHITECTURES](http://staltz.com/unidirectional-user-interface-architectures.html)

##Redux 和 React

Redux 和 React 是没有必然关系的，Redux 用于管理 state，与具体的 View 框架无关。不过，Redux 特别适合那些 state => UI 的框架（比如：React）。

可以使用 react-redux 来绑定 React，react-redux 绑定的组件我们一般称之为 smart components，Smart and Dumb Components 在 react-redux 中区分如下：

###react-redux

[Quick Start](https://github.com/rackt/react-redux/blob/master/docs%2Fquick-start.md)

[API](https://github.com/rackt/react-redux/blob/master/docs/api.md#api)
- Provider store
- connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

<table>
    <thead>
        <tr>
            <th></th>
            <th scope="col" style="text-align:left">Container Components</th>
            <th scope="col" style="text-align:left">Presentational Components</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row" style="text-align:right">Location</th>
          <td>Top level, route handlers</td>
          <td>Middle and leaf components</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">Aware of Redux</th>
          <td>Yes</th>
          <td>No</th>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">To read data</th>
          <td>Subscribe to Redux state</td>
          <td>Read data from props</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">To change data</th>
          <td>Dispatch Redux actions</td>
          <td>Invoke callbacks from props</td>
        </tr>
    </tbody>
</table>


<table>
<tbody>
<tr><td><em></em></td><td><em>Location</em></td><td><em>Direction</em></td><td><em>Use React-Redux</em></td><td><em>To read data, they</em></td><td><em>To change data, they</em></td></tr>
<tr><td>“Smart” Components</td><td>Top level, route handlers</td><td>container</td><td>YES</td><td>Subscribe to Redux state</td><td>Dispatch Redux actions</td></tr>
<tr><td>“Dumb” Components</td><td>Middle and leaf components</td><td>component</td><td>NO</td><td>Read data from props</td><td>Invoke callbacks from props</td></tr>
</tbody>
</table>

> 简单来看：Smart component` 是连接 Redux 的组件（@connect），一般不可复用。Dumb component 是纯粹的组件，一般可复用。
> 两者的共同点是：无状态，或者说状态提取到上层，统一由 redux 的 store 来管理。redux state -> Smart component -> Dumb component -> Dumb component（通过 props 传递）。在实践中，少量 Dumb component 允许自带 UI 状态信息（组件 unmount 后，不需要保留 UI 状态）。
> 值得注意的是，Smart component 是应用更新状态的最小单元。实践中，可以将 route handlers 作为 Smart component，一个 Smart component 对应一个 reducer。

商品详情页结构体实例

商品详情页写法步骤：

* actions ：根据页面描述编写action
* state : 尽量保证状态的简单、数据少
* reducers ： 一旦state确定，reducers的整体轮廓就可以立马写出来，再结合actions编写reducers的细节用来处理action。
* top container component ： 确定顶级容器组件的基本轮廓，为单个的子组件编写做准备
* 分别编写各 子展示组件

> [What Components Should Have State?](http://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html)

> Most of your components should simply take some data from props and render it. However, sometimes you need to respond to user input, a server request or the passage of time. For this you use state.

> <strong>Try to keep as many of your components as possible stateless. </strong>By doing this you'll isolate the state to its most logical place and minimize redundancy, making it easier to reason about your application.

> <strong>A common pattern </strong>is to create several stateless components that just render data, and have a stateful component above them in the hierarchy that passes its state to its children via *props*. The stateful component encapsulates all of the interaction logic, while the stateless > components take care of rendering data in a declarative way.

