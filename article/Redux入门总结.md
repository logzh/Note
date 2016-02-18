## 介绍
> Redux is a predictable state container for JavaScript apps.

> It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as live code editing combined with a time traveling debugger.

> You can use Redux together with React, or with any other view library.It is tiny (2kB) and has no dependencies.

Redux 是 js **应用状态管理库**。是单向数据流应用架构的一种优雅的实现。严格的单向数据流是 Redux 架构的设计核心。Redux 可以让你构建一致化的应用，运行于不同的环境（**客户端、服务器、原生应用**），并且易于测试。

Redux 和 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。

大小 2kb，无依赖。

三大原则
- state 以单一对象存储在 store 对象中。
- state是只读的：这里和Flux思想一致。唯一改变 state 的方法是触发事先定义好的 action。
- 使用纯函数 reducer 执行 state 更新。

三大概念

- Action
- Reducer
- Store

## Action : 本质上是 JavaScript 普通对象
> Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using store.dispatch().

Action 通常只是描述某一特定事情。例如有一个加入购物车的 action：
```
{
  type: 'ADD_CART',
  goods: {
    ...
  }
}
```

通常情况下，我们会使用创建函数（Action Creater）返回 Action 对象。
```
const ADD_CART = 'ADD_CART';

function addToCart(goods) {
  return {
    type: ADD_CART,
    goods
  };
}
```
唯一改变 state 的方法是触发事先定义好的 action。

```
state = store.getState();
store.dispatch(addToCart(goods));
state = store.getState();
```

## Reducer

### 概念
> Actions describe the fact that something happened, but don’t specify how the application’s state changes in response. This is the job of a reducer.

Reducer 是什么呢，Reducer 是用来处理数据逻辑的，具体就是根据 Action 处理 State 的函数。
```
(previousState, action) => newState
```


Action 并没有指出应用要如何更新购物车对应的 State。怎么更新 State 就是 reducer 要做的事情了。

### 编写 Reducer

编写 reducer 前需要确定页面或应用的 state，state 结构确定后 reducer 就出来了。

这里有两个问题：
- 1、怎样设计 state 的数据结构？
- 2、有了 state 结构，怎么编写 reducer？

#### 设计 State 结构

在 Redux 应用中，所有的 state 都被保存在一个单一对象中（这点跟官方的Flux实现**不一样**）。以最简的形式把应用的 state 用对象描述出来（这点跟官方的Flux实现**一样**）。

通常，这个 state 树还需要存放其它一些数据，例如 UI 相关的 state。这样做没问题，但尽量把这些数据与 UI 相关的 state 分开。

例如 state 结构如下：
```
{
  goods:{},
  carts: [{
    ...
  }, {
    ...
  }],
  comments: [{
    ...
  }, {
    ...
  }]
  //相关的 UI state
}
```

#### 根据 State 结构编写 reducer

对于上面的结构编写对应的 reducer 就类似：

```
function app(state = initialState, action) {//这里一个技巧是使用 ES6 参数默认值语法 来精简代码。
  switch (action.type) {
    case 'ACTION_NAME1':
      //处理state //注意1：返回 新的状态，不要修改 state。 应该新建了一个副本。
      return newState;
    case 'ACTION_NAME1':
      //处理state 返回 新的状态
      return newState;
    default://注意2：在 default 情况下返回旧的 state, 如果没有旧的状态就返回初始状态 initialState
      return state;
  }
}
```

而 reducer 是可以拆分和合成的。真正开发项目的时候 State 会涉及很多功能，在一个 reducer 中处理所有逻辑会非常混乱，所以需要拆分成多个小 reducer，
每个 reducer 只处理它管理的那部分State数据。所以根据 state 的结构调整拆分上面的 reducer ：
```
function goods(state = Map(), action) {
  switch (action.type) {
    case types.INIT_GOODS:
      state = Immutable.fromJS(action.goods);
      return state;
    case types.SET_GOODS_COLLECT:
      state = state.update('isCollect', v=>!v);
      state = state.update('collectNum', v=> (state.get('isCollect') ? v + 1 : v - 1));
      return state;
    default:
      return state;
  }
}

function comments(state = List(), action) {
  switch (action.type) {
    case types.INIT_COMMENTS:
      state = Immutable.fromJS(action.comments);
      return state;
    case types.GET_MORE_COMMENT:
      action.comments.map(function(item) {
        state = state.push(item);
      });
      return state;
    default:
      return state;
  }
}

function carts(state = List(), action) {
  switch (action.type) {
    case types.INIT_CARTS:
      state = Immutable.fromJS(action.carts);
      return state;
    case types.ADD_CART:
      state = Immutable.fromJS(action.carts);
      return state;
    default:
      return state;
  }
}

```

redux 提供 combineReducers() 函数来调用我们编写的一系列 reducer，每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，然后这个生成的函数所所有 reducer 的结果合并成一个大的对象。
```
const rootReducer = combineReducers({
  goods,
  comments,
  carts
});

export default rootReducer;
```
至此根据 state 结构编写 reducer 完成。

## Store

action 用来描述“发生了什么”, reducers 会根据 action 更新 state。

Store 就是把它们联系到一起的对象，是用来维持应用的 state 的。

store有四个方法。
- getState： 获取应用当前 state。
- subscribe：添加监听器。
- dispatch：分发 action。更新 state。
- replaceReducer：替换 store 当前用来处理 state 的 reducer。

常用的是dispatch，这是修改State的唯一途径，使用起来也非常简单。

**Redux 应用只有一个单一的 store。当需要拆分处理数据的逻辑时，使用 reducer 组合 而不是创建多个 store**。而官方的 Flux 实现，则是一个应用可以有一个或多个 store， Flux 中 store 的划分可大可小。

创建一个 store ：
```
let store = createStore(rootReducers, initialState);
```
获取 state ：
```
store.getState();
```
更新 state ：
```
store.dispatch(addToCart(goods));
```

## 实例

*example.js* http://rackt.org/redux/

```
import { createStore } from 'redux'

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your project.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter)

// You can subscribe to the updates manually, or use bindings to your view layer.
store.subscribe(() =>
  console.log(store.getState())
)

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

*example2.js* 完整一点的例子

```
import { combineReducers, createStore } from 'redux'
var objectAssign = require('object-assign');

// Action
const ADD_CART = 'ADD_CART';
const SET_GOODS_COLLECT = 'SET_GOODS_COLLECT';

function addToCart(goods) {
  return {
    type: ADD_CART,
    goods
  };
}

function collectGoods() {
  return {
    type: SET_GOODS_COLLECT
  };
}

// reducers
var initGoods = {"id": 123, "name": "星战正版机器人BB-8", isCollect: false};
function goods(state = initGoods, action) {
  switch (action.type) {
    case SET_GOODS_COLLECT:
      return objectAssign({}, state, {isCollect: !state.isCollect});

    default:
      return state;
  }
}

var initCarts = [];
function carts(state = initCarts, action) {//es6 特性
  switch (action.type) {
    case ADD_CART:
      return [...state, action.goods];//es6 特性
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  goods,
  carts
});

let store = createStore(rootReducer);

console.log(store.getState());
store.dispatch(collectGoods());
console.log(store.getState());

store.dispatch(addToCart({"id": 124, "name": "星战正版机器人BB-8", isCollect: false}));
console.log(store.getState());
store.dispatch(addToCart({"id": 125, "name": "星战正版机器人BB-10", isCollect: false}));
console.log(store.getState());
```

![](https://raw.githubusercontent.com/logzh/bookmark/master/image/1452332110_16_w476_h738.png)

在这里只是简单介绍了 Redux，至于 Redux 怎么结合 React 使用，怎么处理异步请求等，将在之后再进行总结。

参考：

- [Redux官方的文档](http://rackt.org/redux/)
- [Redux中文文档](http://camsong.github.io/redux-in-chinese/index.html)