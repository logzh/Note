好记性不如烂笔头，之前陆续写过几篇关于玩物圈前端所用到技术栈的总结，现在在[玩物圈PC版](http://wwq.qq.com/mall/goods/detail.html?id=100002)上线之前，将玩物圈前端用到技术栈整体简单总结梳理下。

##1、webpack

![webpack.png](https://camo.githubusercontent.com/ebc085019011ababb0d35024824304831c7dc72a/68747470733a2f2f7765627061636b2e6769746875622e696f2f6173736574732f6c6f676f2e706e67)

webpack是一款模块加载器兼打包工具，具体使用参考[官方文档](http://webpack.github.io/docs/)，**很详细**。

项目中的主要作用：
- 模块管理：模块化管理js、css、image等文件
- 按照模板生成html：主要使用了html-webpack-plugin插件，按照模版生成html文件，并注入指定的chunks
- 静态资源管理，md5，路径重定位

生产配置
```
var webpack = require('webpack');
var path = require('path');
var entry = require('./entry.js');
var templateConfig = require('./html.template.config.js').pro;
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendor', 'static/js/vendor.[hash:8].js');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  entry: entry,
  output: {
    path: __dirname + '/product',
    publicPath: 'http://cdn.xx.com/', 
    filename: 'static/js/[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],// 配置可以不书写的后缀名
    root: path.join(__dirname, 'public/') //配置绝对路径，alias、entry中会使用
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, 'public'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.(jpg|png|gif)$/,
        loader: 'url?limit=1024&name=static/images/[hash].[ext]'//小于1kb的图片转化为base64，css中其他的图片地址会被体会为打包的地址，此处用到了publicPath
      },
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')}
    ]
  },
  plugins: [
    commonsPlugin,
    new ExtractTextPlugin('static/css/[name].[chunkhash:8].css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    commonsPlugin
  ]
};

for (var i = 0; i < templateConfig.length; i++) {
  config.plugins.push(new HtmlWebpackPlugin(templateConfig[i]));
}

module.exports = config;

```

参考文档：
- [官方文档](http://webpack.github.io/docs/)
- [阮一峰 react-babel-webpack-boilerplate](https://github.com/ruanyf/react-babel-webpack-boilerplate)

##2、Babel

![babel.png](https://raw.githubusercontent.com/babel/logo/master/babel.png)

[Babel](https://babeljs.io/)是一个广泛使用的转码器，可以将ES6代码转为ES5代码，JSX语法代码转为ES5代码。
项目中主要使用Babel将源代码ES6、JSX转码为ES5。

##3、React

![](http://km.oa.com/files/photos/pictures/201602/1456321839_28_w760_h320.jpg)

React提供应用的 View 层，表现为组件，具体参考[官方文档](http://facebook.github.io/react/docs/getting-started.html)

主要知识点：
- JSX （可选的）
- 组件（props、state、生命周期、事件、Form、几个api）
- Virtual Dom

我的总结文章：
- [官方文档](http://facebook.github.io/react/docs/getting-started.html)
- [React入门总结(JSX与组件)](https://segmentfault.com/a/1190000004657228)

##4、Redux（单向数据流）

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。本身跟react没有任何关系。

Redux 除了和 React 一起用外，还支持其它界面库。它体小精悍（只有2kB）且没有任何依赖。

![](http://km.oa.com/files/photos/pictures/201602/1456318094_69_w933_h747.png)

###4.1、基本思想
- Action（普通Action、异步Action）
  - 普通Action，本质是JS普通对象
  - 异步Action，使用了 Thunk middleware 异步 action
- Reducer
  - ( previousState, action ) => newState 
  - 处理数据逻辑
  - 拆分和合并reducer（用 ES6 的 import、export 语法，非常方便）
- Store
 - 联系Action与Reducer的对象，为应用提供state

###4.2、中间件Middleware：

类似 Express 或 Koa 框架中的中间件。它提供的是位于 action 被发起之后，到达 reducer 之前的扩展。
中间件的设计使用了非常多的函数式编程的思想，包括：高阶函数，复合函数，柯里化和ES6语法，源码仅仅20行左右。
项目中主要使用了三个中间件，分别解决不同的问题。
- thunkMiddleware：处理异步Action
- apiMiddleware：统一处理API请求。一般情况下，每个 API 请求都至少需要 dispatch 三个不同的 action（请求前、请求成功、请求失败），通过这个中间件可以很方便处理。
- loggerMiddleware：开发环境调试使用，控制台输出应用state日志

我的总结文章：
- [Redux：一种更优雅的 Flux 实现](http://km.oa.com/group/24792/articles/show/252335)
- [单向数据流之 Flux](http://km.oa.com/group/24792/articles/show/252333)

参考：
- [redux中文文档](http://camsong.github.io/redux-in-chinese/)

##5、react-redux

react-redux的作用是连接（connect）store和容器组件的。store是redux提供的，容器组件是react提供的。

### 5.1 组织应用的组件
- 组织应用的组件
 - 容器组件
 - 展示组件

容器组件：位于应用最顶层的组件，用来与redux连接的。从redux中获取数据作为props。
展示组件：位于应用的中间或者子组件，是纯粹的组件，与redux没有关系。他们从自己的父组件获取数据作为props，他们的共同根组件是应用的唯一的容器组件。展示组件可以维持少量的自身状态信息。

### 5.2 连接Store与组件

react-redux仅仅提供两个关键模块：Provider和connect。

源码：

```
import Provider from './components/Provider'
import connect from './components/connect'

export { Provider, connect }
```

- Provider：是一个组件，接受一个store属性和一个子组件（也就是上面说到的：store是redux提供的，容器组件是是react提供的。）

例子：

```
ReactDOM.render(
    <Provider store={store}>
      {/* note "routerState" here: important to pass it down */}
      <Handler routerState={routerState} />
    </Provider>,
    document.getElementById('root')
  );
```

- connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])：connect返回一个函数，它接受一个React组件的构造函数作为连接对象，最终返回连接好的组件构造函数。

例子：

```
import * as actionCreators from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

export default connect(mapStateToProps, actionCreators)(MyRootComponent)
```
参考：
- [redux中文文档](http://camsong.github.io/redux-in-chinese/)
- [react-redux项目](https://github.com/reactjs/react-redux)

##6、ES6

目前主流的框架（Angular2，React，Koa，Redux）全面转向ES6。项目中使用了部分ES6的明星特性。一开始我是拒绝的，不习惯，现在的感觉是：非常方便，非常爽。

###6.1、Class和Module

模块化：组件按模块编写以及使用、Action和Reducer按模块拆分合并、使用第三方模块，这些在项目中都是使用的是ES6的Module特性，其中编写React组件使用了ES6的Class特性。

例子：

```
import {Types} from '../constants/base/order';

export * from './base/user';
export {fetchCart} from './base/shopCart';
export {fetchOrder} from './base/order';

export function fetchPayResult(id) {
  return {
    url: '/mall/order/payResult/' + id,
    method: 'GET',
    types: ['REQUEST', Types.FETCH_PAY_RESULT, 'FAILURE']
  };
}

export function changePayType(payType) {
  return {
    type: Types.SELECT_PAY_TYPE, payType
  };
}
```

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

###6.2、变量结构赋值

```
var {
      types,
      url = '',
      mockUrl = '',
      method = 'GET',
      dataType = 'json',
      data = {}
      } = action;
```

###6.3、函数的扩展：箭头函数、函数参数的默认值

- 箭头函数：箭头函数在项目中也用得比较多，简化函数的编写，React Stateless function components 的编写。

```
const noop = ()=> false;

let createItem = (item, index) =><Order order={item} key={index}/>;

const Coupon = (props) => (
    <li>
      <div className="coupon-tit">抵用券</div>
      <div className="coupon-price"><span>￥</span><strong>{props.coupon.price}</strong></div>
      <div className="coupon-info">
        <p>{props.coupon.code}</p>

        <p className="time">{props.coupon.endTime}前可用</p>
      </div>
    </li>
);

```

- 函数参数的默认值：典型的应用是编写Reducer。

```
export function address(state = {}, action) {
  switch (action.type) {
    case Types.SELECT_ADDRESS:
      return objectAssign({}, action.payload);
...
```
###6.4、字符串扩展：模板字符串

```
href={`/pc/mall/order/confirm.html?${param}`}
```
```
return {
    mockUrl: '/static/mock/user.address.save.json',
    url: `/user/address/${id}`,
    method: 'PUT',
    data: {id, isDefault},
    types: ['REQUEST', Types.SET_DEFAULT_ADDRESS, 'FAILURE']
  };
```

###6.5、对象的扩展：属性的简洁表示法

```
export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}
```
```
return {
    mockUrl: '/static/mock/user.address.save.json',
    url: `/user/address/${id}`,
    method: 'PUT',
    data: {id, isDefault},
    types: ['REQUEST', Types.SET_DEFAULT_ADDRESS, 'FAILURE']
  };
```

```
App.defaultProps = {
  user: {},
  tips: {visible: false},
  carts: [],
  visibleDropCart: false,
  visibleLoginDialog: false,
  switchLoginDialog() {
  },
  switchTips() {
  },
  switchDropCart() {
  }
};
```

###6.6、let和const
```
const noop = ()=> false;

let createItem = (item, index) =><Order order={item} key={index}/>;
```

参考：
- [Ecmascript 6 入门](https://wohugb.gitbooks.io/ecmascript-6/content/docs/intro.html)

##7、Gulp

Gulp与Grunt一样，也是一个自动任务运行器。它充分借鉴了Unix操作系统的管道（pipe）思想，很多人认为，在操作上，它要比Grunt简单。

项目中主要用到的功能：结合webpack使用、压缩js、ESLint代码检查、压缩css。

```
var gulp = require("gulp");
var gutil = require("gulp-util");
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var reporter = require('eslint-html-reporter');
var fs = require('fs');
var path = require('path');

var webpack = require("webpack");

var webpackConfigProduct = require("./webpack.production.config.js");
var webpackConfigDevelop = require("./webpack.development.config.js");

gulp.task("webpack", function(callback) {
  webpack(webpackConfigProduct, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    callback();
  });
});

gulp.task("webpackDevelop", function(callback) {
  webpack(webpackConfigDevelop, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    callback();
  });
});

var srcJsDir = './public/static/js/';

gulp.task('lint', function() {
  return gulp.src([srcJsDir + '**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format(reporter, function(results) {
            fs.writeFileSync(path.join(__dirname, 'lint-report.html'), results);
          })
      );
});

gulp.task("minifyJs", ['webpack'], function() {
  return gulp.src("./product/**/*.js")
      .pipe(uglify({
        output: {
          max_line_len: 100
        }
      }))
      .pipe(gulp.dest("./product"));
});

gulp.task("minifycssPro", ['webpack'], function() {
  return gulp.src("./product/**/*.css")
      .pipe(minifyCss())
      .pipe(gulp.dest("./product"));
});

gulp.task("minifycssDev", ['webpackDevelop'], function() {
  return gulp.src("./development/**/*.css")
      .pipe(minifyCss())
      .pipe(gulp.dest("./development"));
});

gulp.task('copyJson', function() {
  return gulp.src('./public/static/mock/**/*.json')
      .pipe(gulp.dest('./development/static/mock/'));
});

gulp.task('product', ['minifycssPro', 'minifyJs']);

gulp.task('default', ['minifycssDev', 'copyJson']);
```

参考：
- [官网](http://gulpjs.com/)
- [Gulp：任务自动管理工具](http://javascript.ruanyifeng.com/tool/gulp.html)
- [usage with gulp - Webpack](https://webpack.github.io/docs/usage-with-gulp.html)
