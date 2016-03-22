# 第6章 理解对象

- 理解对象属性
- 创建对象
- 对象继承

## 6.1 理解对象

### 6.1.1 属性类型：两类属性可以同时存在

  - 数据属性： 修改默认特性需要使用ES5的 Object.defineProperty(obj, 'prop', {...}) 方法。IE8 中该方法有限制。
    - [[Configurable]]： 表示是否可以通过 delete 删除属性，能否修改属性的特性，或者把属性修改为访问器属性。默认为 true；
    - [[Enumerable]]： 表示是否可以通过 for-in 循环返回属性。默认为 true；
    - [[Writable]]： 表示能否修改属性的值。默认为 true。
    - [[Value]]： 包含这个属性的数据值。读取写入属性值，都是操作它。默认值为 undefined；
  - 访问器属性：包含一对 getter 和 setter 函数（都不是必须的）。读取属性值时调用 getter 函数，写入属性值时调用 setter 函数。常用来设置一个属性值导致其他属性值发生变化。
    - [[Configurable]]： 同上；
    - [[Enumerable]]： 同上；
    - [[Get]]： 读取属性时调用的函数。默认值为 undefined；
    - [[Set]]： 写入属性时调用的函数。默认值为 undefined；

### 6.1.2 定义多个属性

使用 Object.defineProperties() 方法。

```
Object.defineProperties(book, {_year:{ ... }, editon:{ ... }, year:{ ... }})
```
 
兼容性 IE9+，其他

### 6.1.3 读取属性的特性

使用方法 Object.getOwnPropertyDescriptor(obj, 'prop') 方法。返回一个对象。

## 6.2 创建对象

### 6.2.1 工厂模式

```
 function createPerson(name, age, job) {
	var o = new Object();
	o.name = name;
	o.age = age;
	o.job = job;
	o.sayName = function(){
		alert(this.name);
	};
	return o;
}
```

工厂模式解决了创建多个相似对象问题。但没有解决对象的识别问题（即怎么知道一个对象的类型）。