# 观察者模式

### 2018-04-27

#### Vue源码实现
Vue中实现了观察者模式后在state中对各自的属性进行了初始化，在initData中创建data属性observer实例监听vm实例中data的变化，在computed中通过创建watch实例监听computed属性中各项计算属性的变化。

#### 实现过程

##### Observer类
```
class Observer {
  
  ...

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
```
Observer类中将需要定义的属性加上getter/setter方法

##### Watch类
```
class Watch {
  constructor(vm, expOrFn, cb){
    ...
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
```
Watch类中负责对变化的属性进行队列添加与更新

##### Dep类
```
let dep_uid = 0;

class Dep {
  constructor(){
    this.subs = [];
    this.id = dep_uid++;
  }

  addSub(sub){
    this.subs.push(sub);
  }

  removeSub(sub){
    remove(this.subs, sub)
  }

  depend(){
    if(Dep.target){
      Dep.target.addDep(this) //this为watch类实例
    }
  }

  notify(){
    // 格式化观察者列表
    const subs = this.subs.slice();
    subs.forEach(sub => sub.update())
  }
}

// target作为全局观察者模式中监听的目标
// 全局中任意时刻仅允许执行栈列中第一待执行任务
Dep.target = null;
const targetStack = [];

function pushTarget(_target){
  // 如果当前target指向非空则当前有任务执行中
  // 将_target存入待执行栈列
  if(Dep.target) targetStack.push(Dep.target);
  // 当前target为空，直接执行_target任务
  Dep.target = _target;
}

function popTarget(){
  Dep.target = targetStack.pop();
}

function remove(arr, item){
  if(arr.length){
    const index = arr.indexOf(item)
    if(index > -1){
      return arr.splice(index, 1);
    }
  }
}
```
Dep类负责整个观察模式的添加与执行。
