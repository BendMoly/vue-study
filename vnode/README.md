# VDom渲染

#### 2018-04-24

##### 前期准备

由于目前所要实现的仅为vue框架中对节点的渲染，其中部分模块暂时用到npm库的资源来实现。在浏览器中想像node的环境一样编写代码，所以用到browserify进行解析。
``` 
npm install -g browserify
```
项目中所用到的目前仅有AST转化库（htmlparser)
```
npm install htmlparser --save
```
通过browserify解析将htmlparser模块暴露在window全局中
```
//modules.js
module.exports = htmlparser = require('htmlparser')

//terminal
browserify vnode/modules.js > vnode/bundle.js   //生成全局变量
```

##### 实践过程

定义一个Vue类
```
class Vue {
  constructor(options){
    //遍历options
    ...
    this.init();
  }

  <!-- 初始化 -->
  init(){
    //当前项目初始化仅实现AST树转化
    this.exchangeAST()
  }
  <!-- AST树转化 -->
  exchangeAST(){
    //获取目标节点
    let element = document.querySelector(this.el);
    //使用htmlparser库作AST树转化
    let handler = new htmlparser.DefaultHandler({ verbose: false, ignoreWhitespace: true });
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(element.innerHTML);
    //AST数据渲染与Render
    this.render(handler.dom);
  }
  <!-- Render -->
  render(ast){
    Object.keys(ast).forEach(key => {
      let element = document.querySelector(this.el);
      //根据AST节点生成dom节点
      new VNode(ast[key], element, this.data);
    })
  }
}
```
在一般使用Vue的过程中，首先引入Vue，其次进行实例化
```
const vm = new Vue({
  el: '#app',
  data: {
    name: 'Harry Poter',
    desc: 'Hello world'
  }
})
```
通过实例化会自动进行初始化，获取目标节点进行AST的转化，转化后生成的如下的AST树：
```
{
  0: {
    type: 'tag',
    name: 'div',
    children: [{
      0: {
        type: 'tag',
        name: 'div'
      },
      1: {
        type: 'text',
        data: 'staticNode'
      },
      2: {
        type: 'text',
        data: '{{name}}'
      }
      //...
    }]
  }
  //...
}
```
生成的AST在格式上给的很详细，利用整个树进行遍历渲染从而将数据更新在Dom上。采用这种方式进行渲染主要是考虑到作为MVVM模式，数据驱动渲染中如果每次都将整个Dom进行更新渲染，对性能的影响很大，同时利用这种方式能将静态节点与动态节点区分开来，在之后的diff算法中实时跟踪数据的变化，达到部分Dom的渲染，比起全部会更为高效。  
在当前Render过程中，通过正则和部分硬性判断（后期完善）来区分静态与动态节点，然后将动态节点与Vue实例中的data数据作匹配，添加到Dom节点上。  

> 完整的VNode渲染看vnode.js文件

