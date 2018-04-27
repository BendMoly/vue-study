class Observer {
  constructor(value){
    this.value = value;
    this.init();
  }

  init(){
    this.walk();
  }

  /**
   * 用于对目标对象中的每个属性设置getter/setter方法
   * 这样利于对象中任意属性的变动
   * 在Vue源码中该方法仅限于对象
   * 对于特殊的数组对象采用另一种观察方法
   */
  walk(){
    Object.keys(this.value).forEach(key => {
      this.defineReactive(key, this.value[key]);
    });
  }

  defineReactive(key, value){
    const dep = new Dep();
    Object.defineProperty(this.value, key, {
      enumerable: true,
      configurable: true,
      get(){
        /**
         * Dep.target充当整个观察者列表中的指向作用
         */
        if(Dep.target){
          dep.depend();
        }
        return value;
      },
      set(newVal, value){
        if(newVal === value || (newVal !== newVal && value !== value)) return;
        value = newVal;
        dep.notify();
      }
    })
  }
}
