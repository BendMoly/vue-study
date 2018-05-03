const gulp = require('gulp')
const browserify = require('gulp-browserify')
const rename = require('gulp-rename')

gulp.task('browserify', () => {
  gulp.src('src/vnode/index.js')
      .pipe(browserify({
        insertGlobals: true
      }))
      .pipe(rename('app.js'))
      .pipe(gulp.dest('./dist'))
})
