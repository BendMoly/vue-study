const htmlparser = require('htmlparser')
const VNode = require('./vnode')
const Observer = require('../observer/index')
const Watch = require('../observer/watch')

/**
 * Vue类
 */
module.exports = class Vue {
  constructor(options){
    this.el = options.el;
    this.data = options.data;
    this.computed = options.computed;
    this.init();
  }

  init(){
    Object.keys(this.data).forEach(key => {
      this.proxy(key)
    })
    // vue实例初始化computed计算属性
    this.initComputed()
    new Observer(this.data);
    let ast = this.exchangeAST();
  }

  exchangeAST(){
    let element = document.querySelector(this.el);
    let handler = new htmlparser.DefaultHandler(function(err){}, { verbose: false, ignoreWhitespace: true });
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(element.innerHTML);
    console.log(this);
    console.log(handler.dom);
    this.render(handler.dom);
  }

  render(ast){
    let element = document.querySelector(this.el);
    return new VNode(ast, element, this);
  }

  proxy(key){
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get(){
        return this.data[key];
      },
      set(newValue){
        this.data[key] = newValue
      }
    })
  }

  initComputed(){
    const _watch = Object.create(null);
    
    Object.keys(this.computed).forEach(key => {
      _watch[key] = new Watch(
        this,
        this.computed[key],
        () => {}
      )
      this.proxyComputed(key);
    })
    console.log(_watch);
  }

  proxyComputed(key){
    if(typeof this.computed[key] !== 'function'){
      throw(new Error(`${this.computed[key]} is not a function`))
      return;
    }else {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: this.computed[key]
      })
    }
  }
}
