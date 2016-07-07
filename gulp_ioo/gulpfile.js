/**
 * 初始化
 * npm install gulp-util gulp-imagemin gulp-sass gulp-minify-css gulp-uglify gulp-rename gulp-concat gulp-clean gulp-clean tiny-lr --save-dev
    开发(development)和生产(production)环境，在生产环境时不生成Source Map
 */

//配置
 var config = {
    src:  'ioo_src/',
    dest: 'ioo_dist/',
    scssFiles: 'ioo_src/sass/**/*.scss',
    cssFiles:  'ioo_dist/css/*.css',
    imagesFiles:  'ioo_src/images/**/*',
    jsFiles:  'ioo_src/js/**/*',
    libFiles: 'ioo_src/lib/**/*',
    htmlFiles: 'ioo_src/html/**/*',
    production: false //是否生产环境（默认开发环境）
 }


// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    watch = require('gulp-watch'),             //改善watch
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-sass'),               //sass
    //minifycss = require('gulp-minify-css'),    //css压缩 【被 gulp-clean-css 取代 升级】
    // jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    px2rem = require('gulp-px3rem'),           //px自动转rem
    spritesmith = require('gulp.spritesmith'), //自动雪碧图
    merge = require('merge-stream'),       //合并管道流
    cssBase64 = require('gulp-css-base64');


//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

//start
//先配置postcss环境 gulp-postcss，然后再用其插件postcss-px2rem
var postcss = require('gulp-postcss');
var postcssPx2rem = require('postcss-px2rem');
//end

var cleanCSS = require('gulp-clean-css');//取代 gulp-minify-css,用法一样

// browserSync自动刷新
var browserSync = require('browser-sync');
//过滤文件
var filter = require('gulp-filter');

// 静态服务器
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: config.dest,
            directory: true
        },


    });
});

// Environment task.
gulp.task("set-production", function(){
    config.production = true;
});

// 代理
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "你的域名或IP"
//     });
// });

      
//tinypng图片压缩，以后再研究，免费用户每月500张图片
// var imagemin = require('gulp-tinypng');
// gulp.task('tinypng', function () {
//     gulp.src('src/image.png')
//         .pipe(tingpng('A3lpzrpSHlBZLWGRKXKiQwfPw6OBSnNG'))
//         .pipe(gulp.dest('dist'));
// });



// gulp.task('px2rem', function() {
//   var processors = [px2rem({remUnit: 75})];
//   return gulp.src(config.cssFiles)
//     .pipe(postcss(processors))
//     .pipe(gulp.dest(config.dest+'css'));
// });


// gulp.task('sass', function () {
//   return gulp.src(config.scssFiles)
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest(config.dest+'css'));
// });


// 清空图片、样式、js
// gulp.task('clean', function() {
//     gulp.src(['./dist/css', './dist/js','./dist/images'], {read: false})
//     // gulp.src(['./dist/css', './dist/js/main.js','./dist/js/vendor', './dist/images'], {read: false})
//         .pipe(clean());
// });

// 原样输出处理
gulp.task('lib', function() {
    return gulp.src(config.libFiles)
        .pipe(gulp.dest(config.dest+'lib'));
});

gulp.task('html', function() {
    return gulp.src(config.htmlFiles)
        .pipe(gulp.dest(config.dest+'html'))
        //监听reload
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function() {
    return gulp.src(config.imagesFiles)
        .pipe(imagemin())//压缩图片处理
        .pipe(gulp.dest(config.dest+'images'))
        //监听reload
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('js', function() {
    return gulp.src(config.jsFiles)
        .pipe(uglify())
        .pipe(gulp.dest(config.dest+'js'))
        //监听reload
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('postcss', function () {//什么名字合适呢？sass_postcss_px2rem
  var processors = [postcssPx2rem({remUnit: 75})];
  return gulp.src(config.scssFiles)
      .pipe(sourcemaps.init())

      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(processors))

      // .pipe(sourcemaps.write({includeContent: false}))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(config.dest+'css'))

      //监听reload
      .pipe(filter('**/*.css')) // Filtering stream to only css files
      .pipe(browserSync.reload({stream:true}));
});


gulp.task('base64', function () {
    return gulp.src(config.cssFiles)
        .pipe(cssBase64({
            // baseDir: "../images",
            // maxWeightResource: 100, //Default value: 32768（32x1024） 默认32k
            extensionsAllowed: ['.gif', '.jpg','.png']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.dest+'css'));
});


gulp.task('watch', function () {
  gulp.watch(config.scssFiles, ['postcss']);
  gulp.watch(config.imagesFiles, ['images']);
  gulp.watch(config.jsFiles, ['js']);
  gulp.watch(config.libFiles, ['lib']);
  gulp.watch(config.htmlFiles, ['html']);
});

//清除不必要的文件 如sourcemaps
gulp.task('clean', function() {
    gulp.src([config.dest+'css/maps'], {read: false})
    // gulp.src(['./dist/css', './dist/js','./dist/images'], {read: false})
        .pipe(clean());
});


//开发环境
gulp.task('default',['watch'],function () {
    gulp.start('postcss','images','lib','html','js','browserSync');
});

//发布环境（生产环境）
gulp.task("release", ["clean",'base64']);
