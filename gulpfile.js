const { src, dest, parallel, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const imagesmin = require('gulp-imagemin');
const del = require('del');
const paths = [
    {
        src: './src/sass/pages/**/*.scss',
        dest: './src/pages'
    },
    {
        src: './src/sass/*.scss',
        dest: './src'
    }
];
// Browser-sync
const initBrowserSync = () => {
    browserSync.init({
        server: {
            baseDir: './src'
        },
        ui: {
            port: 8080
        },
        port: 8000,
        online: true
    });
    watch('./src/**/*.scss').on('change', parallel(styles, browserSync.reload));
    watch('./src/**/*.html').on('change', browserSync.reload);
    watch('./src/**/*.js').on('change', browserSync.reload);
    watch('./src/**/*.php').on('change', browserSync.reload);
}
// Styles
const styles = (cb) => {
    cb();
    paths.forEach(patch => {
        return src(patch.src)
        .pipe(sass())
        .on('error', notify.onError({
            message: 'Error: <%= error.message %>',
            title: 'Error'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true,
            cascade: false
        }))
        .pipe(dest(patch.dest))
    });
};
// Images minification
const imagesMinification = () => {
    return src('./src/**/*.+(jpg|png|ico|svg)', { base: './src' })
    .pipe(imagesmin())
    .pipe(dest('./dist'))
};
// Delete dir dist
const deleteDist = () => {
    return del(['./dist']);
};
// Copy file
const copyFile = () => {
    return src([
        './src/libs/**/*.js',
        './src/libs/**/*.php',
        './src/libs/**/*.css',
        './src/libs/**/*.map',
        './src/**/*.html',
        './src/**/*.css',
        './src/**/*.js',
        './src/**/*.+(otf|ttf|woff|woff2|eot)',
        './src/**/*.+(mov|mp4)'
    ], { base: './src' })
    .pipe(dest('./dist'));
};
// Global
exports.deleteDist = deleteDist,
exports.build = series(deleteDist, styles, copyFile, imagesMinification);
exports.watch = initBrowserSync;