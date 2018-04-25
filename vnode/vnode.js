/**
 * @name VNode 转化ast树上的虚拟节点
 * @param { object } ast [ast树]
 * @param { node } parent [父节点]
 * @param { object } data [vue实例数据列表]
 */
class VNode {
  constructor(ast={}, parent, data){
    this.ast = ast;
    this.parent = parent;
    this.elm = document.createElement('div');
    this.$data = data;
    
    this.init();
  }

  init(){
    Object.keys(this.ast).forEach(key => {
      new VDom(this.ast[key], this.elm, this.$data)
    })
    this.parent.innerHTML = this.elm.innerHTML;
  }
  
}

class VDom {
  constructor(options, parent, data){
    this.attribs = options.attribs ? options.attribs : '';
    this.type = options.type ? options.type : '';
    this.name = options.name ? options.name : '';
    this.data = options.data ? options.data : '';
    this.children = options.children ? options.children : '';
    this.parent = parent;
    this.$data = data;
    this.init();
  }

  init(){
    this.createElm();
  }

  // 创建元素
  createElm(){
    // 判断元素节点
    if(this.type == 'tag'){
      let vnode = document.createElement(this.name);
      // 加入节点属性
      if(this.attribs){
        Object.keys(this.attribs).forEach(key => {
          if(key == 'class'){
            vnode['className'] = this.attribs[key]
          }else {
            vnode[key] = this.attribs[key]
          }
        })
      }
      // 添加子元素
      if(Array.isArray(this.children) && this.children.length != 0){
        this.appendChildren(vnode)
      }
      this.parent.appendChild(vnode);
    }
    if(this.type == 'text'){
      // 判断是否为vue数据渲染字段
      let leftIdx, rightIdx;
      if(this.data.indexOf('{{') != -1){
        leftIdx = this.data.indexOf('{{');
        if(this.data.indexOf('}}') != -1){
          rightIdx = this.data.indexOf('}}');
          if(leftIdx < rightIdx){
            this.nameToData();
          }else {
            this.staicRender();
          }
        }else {
          this.staicRender();
        } 
      }else {
        this.staicRender();
      }
    }
  }

  createChildren(child, vnode){
    new VDom(child, vnode, this.$data);
  }

  appendChildren(vnode){
    for(let i = 0; i < this.children.length; i++){
      this.createChildren(this.children[i], vnode);
    }
  }

  nameToData(){
    let delBrackets = this.data.replace(/\{\{((?:.|\n)+?)\}\}/g, ($1, $2) => {
      return $1 = $2;
    });
    // 判断数据字段为字符串类型还是对象类型
    if(delBrackets.indexOf('.') != -1){
      let text = null;
      let temp = null;
      let delDot = delBrackets.trim().split('.');
      let res = this.loopObj(delDot);
      let vnode = document.createTextNode(res);
      this.parent.appendChild(vnode);
    }else {
      let text = null;
      if(this.$data[delBrackets.trim()]){
        text = this.$data[delBrackets.trim()];
      }else {
        throw(new Error('未发现此数据属性'));
      }
      let vnode = document.createTextNode(text);
      this.parent.appendChild(vnode);
    }
  }

  staicRender(){
    let vnode = document.createTextNode(this.data);
    this.parent.appendChild(vnode);
  }

  loopObj(target, newData=this.$data){
    if(!Array.isArray(target)){
      throw(new Error('数据类型错误'));
    }
    let res = newData[target[0]];
    if(target.length > 1){
      target.shift();
      return this.loopObj(target, res);
    }else {
      return res;
    }
  }
}