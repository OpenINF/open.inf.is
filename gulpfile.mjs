/**
 * @file This gulpfile automatically loads when the `gulp` command is run.
 * Within a gulpfile, gulp APIs are often seen, but any vanilla JavaScript or
 * Node modules may be used. Any exported functions will be registered into the
 * gulp task system.
 * @see https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles#gulpfile-explained
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} gulpfile
 */

import browserSync from 'browser-sync';
import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import logger from 'gulplog';

const server = browserSync.create();
// const reload = browserSync.reload;
// var through     = require("through2");

const src = {
  scss: '_sass/*.scss',
  css: 'assets/css',
  html: '*.html',
};

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './_site/',
    },
  });
  done();
}

// Static Server + watching scss/html files.
gulp.task('serve', ['sass'], () => {
  serve(done);

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.html).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', () =>
  gulp
    .src(src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(src.css))
    .pipe(reload({ stream: true }))
);

/**
 * Sass task for live injecting into all browsers
 */
gulp.task('sass', () =>
  gulp
    .src('./app/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/css'))
    .pipe(reload({ stream: true }))
);

gulp.task('sass', () =>
  gulp
    .src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
);

/**
 * Serve and watch the html files for changes
 */
gulp.task('default', () => {
  browserSync({ server: './app' });

  gulp.watch('./app/scss/*.scss', ['sass']);
  gulp.watch('./app/*.html', ['html-watch']);
});

const watch = () => gulp.watch(paths.scripts.src, gulp.series(scripts, reload));

const dev = gulp.series(clean, scripts, serve, watch);
export default dev;

// gulp.task('default', (cb) => {
//   logger.info('GULP THIS!');
//   cb();
// });
