const gulp = require('gulp');

gulp.task('default', ['watchingHTML', 'watchingAPP', 'watchingSRC'], () => {
  console.info('watching task running, good luck');
})