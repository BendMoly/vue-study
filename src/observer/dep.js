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
module.exports = Dep

const targetStack = [];

module.exports = function pushTarget(_target){
  // 如果当前target指向非空则当前有任务执行中
  // 将_target存入待执行栈列
  if(Dep.target) targetStack.push(Dep.target);
  // 当前target为空，直接执行_target任务
  Dep.target = _target;
}

module.exports = function popTarget(){
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