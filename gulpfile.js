var gulp = require('gulp');
var del = require('del');
var tsc = require('gulp-tsc');

var OUT = "dist/";
var SRC = "src/**/*.ts";
var TSC_OPTIONS = {
    module: "commonjs",
    target: "ES5",
    removeComments: true,
    sourceMap: true
};

gulp.task('clean', function(cb) {
    del([OUT], cb);
});

// build depends on clean
gulp.task('compile', ['clean'], function() {
    return gulp.src([SRC])
        .pipe(tsc(TSC_OPTIONS))
        .pipe(gulp.dest(OUT));
});

gulp.task('build', ['clean', 'compile'], function () {
    // RESERVED
});

// gulp = gulp build
gulp.task('default', ['build']);
