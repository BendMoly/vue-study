const pushTarget = require('./dep')
const popTarget = require('./dep')

module.exports = class Watch {
  constructor(vm, expOrFn, cb){
    this.vm = vm;
    this.depIds = [];
    if(typeof expOrFn === 'function'){
      this.getter = expOrFn;
    }else {
      throw(new Error(`监听方法错误,${expOrFn}并不是一个方法`));
    }
    
    this.cb = cb;

    this.value = this.get();
  }

  get(){
    // 当前实践中由于没有采用模块化
    // 所以在引用过程中需确保Dep类加载完毕
    pushTarget(this);
    const vm = this.vm;
    let value = this.getter.call(vm, vm);
    popTarget();

    return value;
  }

  addDep(dep){
    let id = dep.id;
    if(this.depIds.indexOf(id) === -1){
      this.depIds.push(id);
      dep.addSub(this)
    }
  }

  update(){
    let value = this.get();
    if(this.value !== value){
      let oldValue = this.value;
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  }
}