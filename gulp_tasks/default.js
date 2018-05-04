const gulp = require('gulp');

gulp.task('default', ['watchingHTML', 'watchingAPP', 'watchingSRC', 'watchingVUE'], () => {
  console.info('watching task running, good luck');
})