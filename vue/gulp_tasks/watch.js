const gulp = require('gulp')
const livereload = require('gulp-livereload')

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

gulp.task('watchingVUE', () => {
  livereload.listen()
  gulp.watch('dist/vue.js', (event) => {
    livereload.changed(event.path)
    console.log('vue reload finished');
  })
})