var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var templateCache = require('gulp-angular-templatecache');

var paths = {
	src: './src',
	dest: './build'
};

paths.templates = paths.src + '/**/*.html';
paths.js = [
	paths.src + '/**/*module.js',
	paths.src + '/**/*.js'
];
paths.sass = paths.src + '/**/*.scss';
paths.static = [
	'./data',
	'./img',
	'index.html'
];

gulp.task('templates', function () {
  gulp.src(paths.templates)
    .pipe(htmlmin({ quotes: true }))
    .pipe(templateCache('tpls.min.js', { standalone: true }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest))
});

gulp.task('js', function () {
	gulp.src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('sass', function () {
	gulp.src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('bundle.min.css'))
		.pipe(cssnano())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('connect', function () {
	connect.server({
		root: '.',
		port: 1337
	});
});

gulp.task('build', ['templates', 'js', 'sass']);

gulp.task('watch', ['build', 'connect'], function () {
	gulp.watch(paths.templates, ['templates']);
	gulp.watch(paths.js, ['js']);
	gulp.watch(paths.sass, ['sass']);
});

gulp.task('dist', ['build'], function () {
	gulp.src([
		'build/**/*',
		'!build/**/*.map',
		'data/**/*',
		'img/**/*',
		'index.html'
	], { base: './' })
		.pipe(zip('mysite.zip'))
		.pipe(gulp.dest('.'));
});