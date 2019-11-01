var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    csso = require('gulp-csso'),
    del = require('del'),
    browserSync = require('browser-sync'); //.create()

gulp.task('code', function(){
return gulp.src(['app/*.html', 'app/js/*.js'])
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('sass', function(){
	return gulp.src('app/sass/*.sass')
	.pipe(sass())
	.pipe(autoprefix( ['last 15 version', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
  return gulp.src('app/css/*.css')
  .pipe(csso())
  .pipe(rename({suffix: '.mini'}))
  .pipe(gulp.dest('app/css'))
//  .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
   return gulp.src(['app/js/*.js'])
   .pipe(browserSync.reload({stream: true}))
});

gulp.task('clean', function(){
	return del('dist/*');
});

gulp.task('browser-sync', function(){	
	browserSync({
		server:{
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('watch', function(){
	gulp.watch('app/*.html', gulp.parallel('code'));	
	gulp.watch('app/sass/main.sass', gulp.parallel('sass')); /*вот он, здесь укызывается массив тасков( в виде путей исходников) за которыми надо следить*/
	gulp.watch('app/css/*.css', gulp.parallel('css'));
	gulp.watch('app/js/*.js', gulp.parallel('script'));
	gulp.watch('app', gulp.parallel('browser-sync'));
});

gulp.task('build',  function(){
	gulp.series('clean', 'css');
	
	let buildCss = gulp.src(['app/css/main.mini.css'])
	.pipe(gulp.dest('dist/css'));
	
	let buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));
	
	let js = gulp.src('app/js/*.js')
	.pipe(gulp.dest('dist/js'));
	
	let buildHTML = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
	
	let buildImg = gulp.src('app/img/**/*')
	.pipe(gulp.dest('dist/img'));	
});

gulp.task('dev', function(){
	gulp.series('build', 'watch')
});

//  команда npm i позволяет создать в новых проектах jsonLock b node modules
// дуфолтный таск, нужен для новых проектов, команда: просто! gulp
gulp.task('default', gulp.series('clean', gulp.parallel('code','sass','css', 'script'), 'watch'))

