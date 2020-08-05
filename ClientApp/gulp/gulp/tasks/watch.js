require('./styles');
var gulp = require("gulp");
var watch = require("gulp-watch");
var browserSync = require('browser-sync').create(); // enables refreshing websites when html, css changes


gulp.task('watch', function () {

    // browserSync.init({
    //     server: {
    //         baseDir: "app"
    //     }
    // });

    // watch('./app/index.html', function () {
    //     browserSync.reload();
    // });

    watch('./gulp/assets/styles/**/*.scss', gulp.series('styles', function () {
        // browserSync.reload();
        console.log('finished creating css')
        // gulp.start('styles');
    }));

});


// gulp.task('cssInject', gulp.series('styles', function () { //styles task must be run before

//     console.log('injecting..')
//      return gulp.src('./app/assets/styles/styles.css')
//     //     .pipe(browserSync.stream());

// }));