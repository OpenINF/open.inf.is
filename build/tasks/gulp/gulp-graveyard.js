// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { PATHS } from '@openinf/portal/build/constants';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
// skipcq: JS-C1003 - del does not expose itself as an ES Module.
import * as del from 'del';
import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import run from 'gulp-run';
import sourcemaps from 'gulp-sourcemaps';
import logger from 'gulplog';

const server = browserSync.create();
const reload = browserSync.reload;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * function to properly reload your browser
 * @param {function} done The callback function to call when the task is complete or an error occurs.
 *                        The callback should have the following signature:
 *                        function(err) { ... }
 *                          - err {Error|null} - The error object if an error occurred, null otherwise.
 */
// function reload(done) {
//   server.reload(/*{ stream: true }*/);
//   done(null);
// }

/**
 *
 * @param {function} done The callback function to call when the task is complete or an error occurs.
 *                        The callback should have the following signature:
 *                        function(err) { ... }
 *                          - err {Error|null} - The error object if an error occurred, null otherwise.
 */
function serve(done) {
  server.init({
    server: {
      baseDir: PATHS.siteDir,
    },
    ghostMode: false, // Toggle to mirror clicks, reloads etc (performance)
    logFileChanges: true,
    logLevel: 'debug',
    open: true, // Toggle to auto-open page when starting
    port: 4000, // change port to match default Jekyll
  });
  done(null);
}

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

/**
 * Sass task for live injecting into all browsers.
 * Compiles sass into CSS.
 */
gulp.task('build:styles:main', (done) => {
  gulp
    .src(`${PATHS.sassFiles}/main.scss`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        precision: 10,
        onError: browserSync.notify,
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(PATHS.jekyllCssFiles))
    .pipe(gulp.dest(PATHS.siteCssFiles))
    .pipe(browserSync.stream());

  done(null);
});

// Static Server + watching scss/html files.
// gulp.task('serve', ['sass'], (done) => {
//   serve(done);

//   gulp.watch(PATHS.sassPattern, ['sass']);
//   gulp.watch(PATHS.htmlPattern).on('change', reload);
// });

/**
 * Serve and watch the html files for changes
 */
// gulp.task('default', () => {
//   browserSync({ server: './app' });

//   gulp.watch('./app/scss/*.scss', ['sass']);
//   gulp.watch('./app/*.html', ['html-watch']);
// });

// const watch = () => gulp.watch(PATHS.scripts.src, gulp.series(scripts, reload));

// const dev = gulp.series(clean, scripts, serve, watch);
// export default dev;

// Create and process critical CSS file to be included in head
// gulp.task('build:styles:critical', () => {
//   return gulp
//     .src(`${PATHS.sassFiles}/critical.scss`)
//     .pipe(
//       sass({
//         outputStyle: 'compressed',
//         trace: true,
//         loadPath: [PATHS.sassFiles],
//       }).on('error', sass.logError)
//     )
//     .pipe(postcss([autoprefixer(), cssnano()]))
//     .pipe(gulp.dest('_includes'))
//     .pipe(browserSync.stream());
//   // .on('error', logger);
// });

// Build all styles
gulp.task(
  'build:styles',
  gulp.series(['build:styles:main' /*, 'build:styles:critical'*/])
);

// Concatenate and uglify global JS files and output the result to the
// appropriate location
// gulp.task('build:scripts:global', () => {
//   return gulp
//     .src([PATHS.jsFiles + '/lib' + PATHS.jsPattern, PATHS.jsFiles + '/*.js'])
//     .pipe(concat('main.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest(PATHS.jekyllJsFiles))
//     .pipe(gulp.dest(PATHS.siteJsFiles))
//     .on('error', logger);
// });

// Uglify local JS files and output the result to the appropriate location
// gulp.task('build:scripts:local', () => {
//   return gulp
//     .src(PATHS.jsFiles + '/local' + PATHS.jsPattern)
//     .pipe(uglify())
//     .pipe(gulp.dest(PATHS.jekyllJsFiles))
//     .pipe(gulp.dest(PATHS.siteJsFiles))
//     .on('error', logger);
// });

// Build all scripts
// gulp.task('build:scripts', ['build:scripts:global', 'build:scripts:local']);

// Optimize and copy image files
// gulp.task('build:images', () => {
//   return gulp
//     .src(PATHS.imageFilesGlob)
//     .pipe(
//       imagemin({
//         optimizationLevel: 3,
//         progressive: true,
//         interlaced: true,
//         use: [imageminPngquant()],
//       })
//     )
//     .pipe(gulp.dest(PATHS.jekyllImageFiles))
//     .pipe(gulp.dest(PATHS.siteImageFiles))
//     .pipe(browserSync.stream());
// });

// Run jekyll build command.
gulp.task('build:jekyll', (done) => {
  const shellCommand = 'bundle exec jekyll build --config _config.yml';
  run(shellCommand);
  done(null);
});

// Runs jekyll build command using test config.
// gulp.task('build:jekyll:test', () => {
//   const shellCommand =
//     'bundle exec jekyll build --config _config.yml, _config.test.yml';
//   return gulp
//     .src('.', { allowEmpty: true })
//     .pipe(run(shellCommand))
//     .on('error', logger);
// });

// Run jekyll build command using local config
gulp.task('build:jekyll:local', () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(run('bundle exec jekyll build'))
    .on('error', logger);
});

// Special tasks for building and reloading BrowserSync
gulp.task(
  'build:jekyll:watch',
  gulp.series('build:jekyll:local', (done) => {
    reload();
    done(null);
  })
);

// gulp.task('build:scripts:watch', gulp.series('build:scripts', (done) => {
//   reload();
//   done(null);
// }));

// Build site
gulp.task(
  'build',
  gulp.series([
    // 'build:scripts',
    'build:styles',
    // 'build:images',
    // 'build:fonts',
    // 'build:downloads',
    'build:jekyll',
  ])
);

// 'gulp serve' -- Serve site; open site in browser, watch for changes in source
// files, and update them when needed.
gulp.task(
  'serve',
  gulp.series('build', (done) => {
    serve(done);

    gulp.watch('_config.yml', gulp.series('build:jekyll:watch'));
    // Watch .scss files and pipe changes to browserSync
    gulp.watch(PATHS.sassFilesGlob, gulp.series('build:styles'), reload());
    // Watch .js files
    // gulp.watch('_assets/js/**/*.js', gulp.series('build:scripts:watch'));
    // Watch image files and pipe changes to browserSync
    // gulp.watch('_assets/img/**/*', gulp.series('build:images'));
    // Watch posts
    gulp.watch(PATHS.jekyllPostFilesGlob, gulp.series('build:jekyll:watch'));

    // Watch drafts if --drafts flag was passed
    // if (module.exports.drafts) {
    //   gulp.watch(PATHS.jekyllDraftFilesGlob, gulp.series('build:jekyll:watch'));
    // }

    // Watch html and markdown files
    // gulp.watch(
    //   [PATHS.htmlPattern, PATHS.markdownPattern, `!${PATHS.siteDir}`],
    //   gulp.series('build:jekyll:watch')
    // );

    // Watch RSS feed
    // gulp.watch('feed.xml', gulp.series('build:jekyll:watch'));

    // Watch data files
    // gulp.watch(PATHS.dataPattern, gulp.series('build:jekyll:watch'));

    done(null);
  })
);

// Delete CSS
gulp.task('clean:styles', (done) => {
  del([
    `${PATHS.jekyllCssFiles}main.css`,
    `${PATHS.siteCssFiles}main.css`,
    '_includes/critical.css',
  ]);
  done(null);
});

// // Delete processed JS
// gulp.task('clean:scripts', (done) => {
//   del([`${PATHS.jekyllJsFiles}main.js', `$PATHS.siteJsFiles}main.js`]);
//   done(null);
// });

// // Delete processed images
// gulp.task('clean:images', (done) => {
//   del([PATHS.jekyllImageFiles, PATHS.siteImageFiles]);
//   done(null);
// });

// // Delete processed font files
// gulp.task('clean:fonts', (done) => {
//   del([PATHS.jekyllFontFiles, PATHS.siteFontFiles]);
//   done(null);
// });

// Delete the entire _site directory
gulp.task('clean:jekyll', (done) => {
  del([PATHS.siteDir]);
  done(null);
});

// Deletes _site directory and processed assets
gulp.task(
  'clean',
  gulp.series([
    'clean:jekyll',
    'clean:styles',
    // 'clean:scripts',
    // 'clean:images',
    // 'clean:fonts',
    // 'clean:downloads',
  ])
);
