var gulp = require("gulp");
var postCss = require('gulp-postcss'); //gulp plugin enables builiding, modyfing css files dynamically

var autoprefixer = require('autoprefixer'); //changes css tags so they can be used in webkit browsers
var cssvars = require('postcss-simple-vars'); //enables creating sass variables on css files
var nasted = require('postcss-nested'); //enables creating nested css tags, which improves organization of css files
var cssimport = require('postcss-import'); //enables creating css modules, which are imported into one file when builiding application
var mixins = require('postcss-mixins'); //enables implementing responsive css
var forLoop = require('postcss-for'); //enables creating loops

gulp.task('styles', function () {
    console.log('styling')

    return gulp.src('./gulp/assets/styles/styles.css')
        .pipe(postCss([cssimport, mixins, forLoop, cssvars, autoprefixer, nasted]))
        // .on('error', function (error) {
        //     console.log(error.toString())
        //     this.emit('end'); //it tells gulp that task ended and gulp can continue working

        // })
        .pipe(gulp.dest('./src/styles'))
});