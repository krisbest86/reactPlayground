var gulp = require('gulp');
var gulpSVG = require('gulp-svg-sprite');
var gulpRename = require('gulp-rename');

var config = {
    mode: {
        css: {
            render: {
                css: {
                    template: './app/gulp/templates/sprite.css'
                }
            }
        }
    }
}


gulp.task('createSprite', function () {

    return gulp.src('./app/assets/images/icons/**/*.svg')
        .pipe(gulpSVG(config))
        .pipe(gulp.dest('./app/temp/sprite/'));

});

gulp.task('copySpriteCss', function () {

    return gulp.src('./app/temp/sprite/css/*.css')
        .pipe(gulpRename('_sprite.scss'))
        .pipe(gulp.dest('./app/assets/styles/modules'))

});