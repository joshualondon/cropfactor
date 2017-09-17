var gulp = require('gulp'),

  // browserSync
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,

  // CSS
  sass = require('gulp-sass'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  atImport = require('postcss-import'),

  // Utils
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  cp = require('child_process'),
  notify = require('gulp-notify'),
  shell = require('gulp-shell'),
  runSequence = require('run-sequence');

// Constants
const sourceRoot = '_src/';
const devRoot = '_dev/';
const dist = '_dist/';


// ------------------------------------------------------
// CSS
gulp.task('css', function() {
  return gulp.src([sourceRoot + 'assets/sass/cropfactor.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
  	autoprefixer({
  		browsers: ['last 5 versions', 'iOS 8']
  		})
  	]))
    .pipe(rename('cropfactor.css'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(devRoot + 'assets/css/'))
    .pipe(browserSync.stream({ match: '**/*.css' })) // 'match' is used to prevent reload with sourcemaps file
    .pipe(notify({ message: '✓ Main CSS complete' }));
});


// ------------------------------------------------------
// Copy vendor JS
gulp.task('vendorjs', function() {
  return gulp.src([sourceRoot + 'assets/js/vendor/*.js'])
    .pipe(gulp.dest(devRoot + 'assets/js/vendor/'))
});

// ------------------------------------------------------
// JS
gulp.task('js', function() {
  return gulp.src([sourceRoot + 'assets/js/*.js'])
    .pipe(concat('cropfactor.js'))
    .pipe(gulp.dest(devRoot + 'assets/js/'))
    .pipe(notify({ message: '✓ JS complete' }))
});



// ------------------------------------------------------
// Jekyll
const child = require('child_process');
gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
      '--incremental',
      '--drafts',
      '--unpublished',
      '--future'
    ]);

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});



// ------------------------------------------------------
// Reload
gulp.task('reload', function() {
	browserSync.reload();
});



// ------------------------------------------------------
// Serve - browserSync
gulp.task('serve', function() {

    browserSync.init({
        port: 3726,
        notify: false,
        server: {
            baseDir: devRoot
        }
    });

	// watch the CSS
	gulp.watch([sourceRoot + '**/*.scss'], ['css']);

	// watch the critical css and reload the browser (because it's injected into the html head)
	//gulp.watch(sourceRoot + 'assets/_criticalcss/criticalcss.scss', ['criticalcss', 'jekyll']);

	// watch html and markdown to run jekyll
	gulp.watch([
		sourceRoot + '**/*.html',
		sourceRoot + '**/*.md',
	], ['jekyll']);

  // gulp.watch([
  //   sourceRoot + '/_data/**/*.json'
  // ], ['jekyll', 'reload']);

  // watch the html in the dist folder to refresh browser
  // waits for jekyll to finish building
  gulp.watch([
    devRoot + '**/*.html'
  ], ['reload']);

  gulp.watch([
    sourceRoot + '**/*.js'
  ], ['js', 'reload']);
});

gulp.task('default', ['css', 'js', 'jekyll', 'serve']);
