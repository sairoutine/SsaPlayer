'use strict';

// ソース元の対象ファイル
var source_file = './src/SsaPlayer.js';
// 出力ディレクトリ
var dist_dir = './';
// アプリファイル
var appjs = 'TmpSsaPlayer.js';
// minify後のアプリ名ファイル
var appminjs = 'SsaPlayer.js';

var watch      = require('gulp-watch');
var browserify = require('browserify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var uglify     = require("gulp-uglify");
var rename     = require('gulp-rename');
var plumber    = require('gulp-plumber');
var runSequence= require('run-sequence');
var path       = require('path');
var notify     = require('gulp-notify');

gulp.task('browserify', function() {
	return browserify(source_file)
		.bundle()
		.on('error', function(err){   //ここからエラーだった時の記述
			// デスクトップ通知
			var error_handle = notify.onError('<%= error.message %>');
			error_handle(err);
			this.emit('end');
		})
		.pipe(source(appjs))
		.pipe(gulp.dest(dist_dir));
});

gulp.task('minify', function() {
	return gulp.src(path.join(dist_dir, appjs))
		.pipe(uglify())
		.pipe(rename(appminjs))
		.pipe(gulp.dest(dist_dir));
});


gulp.task('build', function(callback) {
	return runSequence(
		'browserify',
		'minify',
		callback
	);
});

gulp.task('watch', function() {
	watch(['src/js/**/*.js'], function(event) {
		gulp.start("build");
	});
});
