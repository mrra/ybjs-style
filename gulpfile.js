var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var del = require('del');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');


var destFolder = './ybjs-assets/'
var paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    src_main: 'src/styles/style.scss',
    dest: destFolder
  },
  fonts: {
  	'src': 'src/fonts/**/*',
  	'dest': destFolder + 'fonts/'
  }
};

function clean () {
  return del([destFolder], {force: true});
}

function fonts () {
	return gulp.src([paths.fonts.src]).pipe(gulp.dest(paths.fonts.dest));
}

function styles () {
  return gulp.src(paths.styles.src_main, { sourcemaps: true })
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(minify())
    .pipe(rename({
      basename: 'ybjs',
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify('CSS compiled!'));
}


function watch () {
  gulp.watch(paths.styles.src, styles);
}

var build = gulp.series(clean, gulp.parallel(styles, fonts));
var watch = gulp.series(watch);
var dev = gulp.series(build, watch);

gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('default', dev);