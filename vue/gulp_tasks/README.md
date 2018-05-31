#### 使用gulp搭建项目结构

> 本文不作为标准的gulp项目构建文档，只针对该项目做初略总结。

在以往使用gulp的过程中经常要对路径进行引用，重新使用gulp作构建工具使用了```require-dir```库分割各个gulp task任务。
```
require('require-dir')('./gulp_tasks');
```
在各个任务（task）中写任务流程，在运行过程中如果仅使用```gulp```命令则默认采用```default```模式，所以将所有需要运行的任务在default中包含起来
```
//...
gulp.task('default', ['watchingHTML', 'watchingAPP', 'watchingSRC'], () => {
  console.info('watching task running, good luck');
})
```
一般开发模式最需要的就是对文件的更改能及时刷新浏览器，这点采用```gulp-livereload```进行处理，同时利用谷歌浏览器（chrome）中的扩展程序（LiveReload）监听页面达到及时刷新的效果。
> 需要注意的是使用livereload监听为服务器地址，浏览器访问文件路径并不能被监听。
```
//...

gulp.task('watchingHTML', () => {
  livereload.listen()
  gulp.watch('./index.html', (event) => {
    livereload.changed(event.path)
    console.log('html reload finished');
  })
})

gulp.task('watchingAPP', () => {
  livereload.listen()
  gulp.watch('./dist/app.js', (event) => {
    livereload.changed(event.path)
    console.log('app reload finished');
  })
})

gulp.task('watchingSRC', () => {
  gulp.watch('src/*/*.js', ['browserify']);
})
```
这里不了解整个livereload的实现机制，但仅在一个task监听3个任务的话只有第一个任务被刷新，所以分成了3个，而且这里仅是希望浏览器能运行node的环境，所以对gulp的使用不深究，以后有接触到再研究。