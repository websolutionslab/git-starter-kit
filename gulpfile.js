var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imageMin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'src/js/**/*.js',
    imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',

    cssout: 'dist/css',
    jsout: 'dist/js',
    imgout: 'dist/img',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    jsoutname: 'script.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js'
};


gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('serve', [ 'sass' ], function () {
    browserSync({
        server: config.src
        // sass: 'scss'
    });
    gulp.watch([config.htmlin, config.jsin], [ 'reload' ]);
    gulp.watch(config.scssin, [ 'sass' ]);
});

gulp.task('sass', function () {
    return gulp.src(config.scssin)
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            //configuration docs github.com/ai/browserslist  browserl.ist
            browsers: [ 'last 3 versions' ]
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(config.scssout))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    return gulp.src(config.cssin)
        .pipe(concat(config.cssoutname))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function () {
    return gulp.src(config.jsin)
        .pipe(concat(config.jsoutname))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function () {
    return gulp.src(config.imgin)
        .pipe(changed(config.imgout))
        .pipe(imageMin())
        .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function () {
    return gulp.src(config.htmlin)
        .pipe(htmlReplace({
            'css': config.cssreplaceout,
            'js': config.jsreplaceout
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function () {
    return del([ config.dist ]);
});

gulp.task('build', function () {
    sequence('clean', [ 'html', 'js', 'css', 'img' ])
});

gulp.task('default', [ 'serve' ]);