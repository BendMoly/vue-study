# vue-study
vue源码学习笔记

#### 前言

做前端的过程中一直处于一种写项目业务的交互实现的过程，虽然已经从jQuery向Vue迁移，但对于vue底层的实现一直没有仔细研究，所以建个仓库，首先对vue中比较重要的知识点做个梳理。

---

#### MVVM模式

##### 2018-04-27修改
1. 完成观察者模式

> （***vnode***）模块用于实现虚拟DOM对数据的渲染，目前整个MVVM模式的实现还欠缺~~观察者（***observer***）模块监听数据~~、diff（虚拟节点更新算法）、指令（***directives***）模块

Vue框架中利用此模式，对View（视图层）与Model（模型数据层）做到一个连接效果，相比每次数据更新重新渲染整个Dom节点，利用数据的监听与虚拟节点diff比较实现部分节点更新，性能得到有效提升。

MVVM模式主要关注到的点在于以下要素：

1. 响应式：利用观察者模式监听Model层中数据的变化通知View变动。
2. 模版引擎：涉及到Vue框架中directives指令的实现，开发过程中主要通过在模版添加指令或数据格式等（v-for、v-model、{{item}})完成一个html模版并解析成JavaScript函数，通过第3点完成整个流程。
3. 虚拟DOM：模版中的目标节点通过生成ast树，这部分成为虚拟节点。利用ast树与Model层实例数据进行匹配渲染出真正的DOM树。

#### 参考链接
[快速了解 Vue2 MVVM —GitHub](https://github.com/wangfupeng1988/learn-vue2-mvvm)

---

#### 观察者模式

观察者模式在整个框架中起到一个关键作用，通过对数据的变化进行观察监听及时完成model=>view之间的交互。这里通过computed计算属性的实现来解释观察者模式在框架中的应用。具体文档介绍看```/observer```目录

#### 参考链接
[深入理解 Vue Computed 计算属性 —segmentFault](https://segmentfault.com/a/1190000010408657)  
[深入响应式原理 —cn.vuejs.org](https://cn.vuejs.org/v2/guide/reactivity.html)


---

#### 生命周期lifecycle


![image](https://github.com/BendMoly/vue-study/raw/master/static/lifecycle.png)  

说起Vue的生命周期就不得不将这张图祭出来。Vue的生命周期有```created/mounted/updated/destroyed```以及其对应的```before```hook。在整个生命周期中，```callhook```方法能帮我们看到整个周期流程。

###### src/core/instance/lifecycle.js
```
export function callHook (vm: Component, hook: string) {
  pushTarget()
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```


在一个Vue类实例化时，在初始化中首先进行的就是```beforeCreate/created```操作。

###### src/core/instance/init.js
```
// ...
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```
之后依次对应执行其他周期。在所有周期hook的进行中，```destroyed```相关的都是在实例被销毁时执行。实例初始化完成后整个实例中vnode都会被观察者模式进行监听，这点在上节有提及过。改变view层的视图或model层的数据都会出发patch对虚拟节点进行更新，以销毁为例，在整个vnode树中所生成的子组件都存放在根实例的```$children```中，在patch的过程中如果vnode中的children减少，这个时候就会唤醒```invokeDestroyHook```方法.
```
function invokeDestroyHook (vnode) {
  var i, j;
  var data = vnode.data;
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
    for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
  }
  if (isDef(i = vnode.children)) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j]);
    }
  }
}
```
究其所有主要还是由整个vnode的更新patch相关。介于此我们就可以根据业务需求在不同的周期钩子中实现功能。

---

#### 参考链接
[Vue 2.0源码学习](https://segmentfault.com/a/1190000007484936)
