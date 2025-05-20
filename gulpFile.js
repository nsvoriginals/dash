import gulp from 'gulp'
import rename from 'gulp-rename';
import resume from 'gulp-resume';

gulp.task('generate-resume', function() {
  return gulp.src('./resume.json')
    .pipe(resume({
      format: 'html',
      theme: 'flat'
    }))
    .pipe(gulp.dest('./public/resume'));
});

gulp.task('default', gulp.series('generate-resume'));