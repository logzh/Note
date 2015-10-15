#什么是 webpack？

webpack是近期最火的一款模块加载器兼打包工具，它能把各种资源，例如JS（含JSX）、coffee、样式（含less/sass）、图片等都作为模块来使用和处理。
![流程图.png](http://webpack.github.io/assets/what-is-webpack.png "")
我们可以直接使用 require(XXX) 的形式来引入各模块，即使它们可能需要经过编译（比如JSX和sass），但我们无须在上面花费太多心思，因为 webpack 有着各种健全的加载器（loader）在默默处理这些事情，这块我们后续会提到。

你可以不打算将其用在你的项目上，但没有理由不去掌握它，因为以近期 Github 上各大主流的（React相关）项目来说，它们仓库上所展示的示例已经是基于 webpack 来开发的，比如 React-Bootstrap 和 Redux。

webpack的官网是 http://webpack.github.io/ ，文档地址是 http://webpack.github.io/docs/ ，想对其进行更详细了解的可以点进去瞧一瞧。
