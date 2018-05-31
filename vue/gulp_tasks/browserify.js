const gulp = require('gulp')
const browserify = require('gulp-browserify')
const rename = require('gulp-rename')
const livereload = require('gulp-livereload')

gulp.task('browserify', () => {
  gulp.src('src/vnode/index.js')
      .pipe(browserify({
        insertGlobals: true
      }))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('./dist'));
  console.log('browserify again');
})
