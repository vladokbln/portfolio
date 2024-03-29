"use strict";

/* параметры для gulp-autoprefixer */
var autoprefixerList = [
  'Chrome >= 45',
  'Firefox ESR',
  'Edge >= 12',
  'Explorer >= 10',
  'iOS >= 9',
  'Safari >= 9',
  'Android >= 4.4',
  'Opera >= 30'
];
/* пути к исходным файлам (src), к готовым файлам (build), файлам (watch) */
var path = {
  build: {
    html:  'build/',
    js:    'build/js/',
    css:   'build/css/',
    img:   'build/img/',
    spr:   'src/img/sprite',
		fonts: 'build/fonts/',
    webFonts: 'build/webfonts/'		
  },
  src: {
    html:  'src/*.html',
    js:    'src/js/main.js',
    style: 'src/style/main.less',
    img:   'src/img/**/*.*',
    spr:   'src/img/icon/*.png',
    fonts: 'src/fonts/**/*.*',
    webFonts: 'src/bower_components/components-font-awesome/webfonts/**/*.*'
  },
  watch: {
    html:  'src/**/*.html',
    js:    'src/js/**/*.js',
    css:   'src/style/**/*.less',
    img:   'src/img/**/*.*',
    spr:   'src/img/sprite/.png',
		fonts: 'srs/fonts/**/*.*',
		webFonts: 'src/bower_components/components-font-awesome/webfonts/**/*.*'
  },
  clean:     './build'
};
/* настройки сервера */
var config = {
  server: {
    baseDir: './build'
  },
  notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
  webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
  rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
  sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
  less = require('gulp-less'), // модуль для компиляции less в CSS
  autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
  cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
  uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
  cache = require('gulp-cache'), // модуль для кэширования
  imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
  jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
  pngquant = require('imagemin-pngquant'), // плагин для сжатия png
  del = require('del'), // плагин для удаления файлов и каталогов
  notify = require('gulp-notify'), // уведомления ошибок
  run = require('run-sequence'),
  spritesmith = require('gulp.spritesmith'); // сборка спрайтов  

/* задачи */

// запуск сервера
gulp.task('webserver', function (cd) {
  webserver(config);
	cd();
});

// сбор html
gulp.task('html:build', function (cb) {
  gulp.src(path.src.html) 
    .pipe(plumber()) 
    .pipe(rigger()) 
    .pipe(gulp.dest(path.build.html)) 
    .pipe(webserver.reload({stream: true})
	);
	cb();
});

// сбор стилей
gulp.task('css:build', function (cb) {
  gulp.src(path.src.style) 
    .pipe(plumber()) 
    .pipe(sourcemaps.init()) 
    .pipe(less().on("error", notify.onError(function (error) {
      return "Message to the notifier: " + error.message;
    })))  
    .pipe(autoprefixer({ 
      browsers: autoprefixerList
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./')) 
    .pipe(gulp.dest(path.build.css)) 
    .pipe(webserver.reload({stream: true,logSnippet:false})
	);
	cb();
});

// сбор js
gulp.task('js:build', function (cb) {
  gulp.src(path.src.js) 
    .pipe(plumber()) 
    .pipe(rigger()) 
    .pipe(sourcemaps.init()) 
    .pipe(uglify()) 
    .pipe(sourcemaps.write('./')) 
    .pipe(gulp.dest(path.build.js)) 
    .pipe(webserver.reload({stream: true})
	);
	cb(); 
});

// перенос шрифтов
gulp.task('fonts:build', function(cb) {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts)
	);
	cb();
});

// перенос web-шрифтов
gulp.task('webFonts:build', function(cb) {
  gulp.src(path.src.webFonts)
    .pipe(gulp.dest(path.build.webFonts)
	);
	cb();
});

// обработка картинок
gulp.task('image:build', function (cb) {
  gulp.src([path.src.img, '!src/img/**/*.less'])
    .pipe(cache(imagemin([ 
      imagemin.gifsicle({interlaced: true}),
        jpegrecompress({
          progressive: true,
          max: 90,
          min: 80
        }),
        pngquant(),
        imagemin.svgo({plugins: [{removeViewBox: false}]})
  	])))
    .pipe(gulp.dest(path.build.img)
	);
	cb();
});

gulp.task('sprite:build', function (cb) {
  var spriteData = gulp.src(path.src.spr).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.less',
    imgPath: '../img/sprite/sprite.png'
  }));
  return spriteData.pipe(gulp.dest(path.build.spr));
	cb();
});

// удаление каталога build 
gulp.task('clean:build', function (cb) {
  del.sync(path.clean);
	cb();
});

// очистка кэша
gulp.task('cache:clear', function () {
  cache.clearAll();
});

// сборка
gulp.task('build', gulp.series(
  'clean:build',
	'html:build',
	'css:build',
	'js:build',
	'fonts:build',
	'webFonts:build',
	'sprite:build',
	'image:build'
));

// запуск задач при изменении файлов
gulp.task('watch', function() {
  gulp.watch(path.watch.html, gulp.series('html:build'));
  gulp.watch(path.watch.css, gulp.series('css:build'));
  gulp.watch(path.watch.js, gulp.series('js:build'));
  gulp.watch(path.watch.spr, gulp.series('sprite:build'));
  gulp.watch(path.watch.img, gulp.series('image:build'));
	gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
  gulp.watch(path.watch.webFonts, gulp.series('webFonts:build'));	
});
 
// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    'webserver',
    'watch'
));