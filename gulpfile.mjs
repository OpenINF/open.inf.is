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

import { PATHS } from '@openinf/portal/build/constants';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import logger from 'gulplog';

const server = browserSync.create();
// const reload = browserSync.reload;
// var through     = require("through2");

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: PATHS.siteDir,
    },
  });
  done();
}

// Static Server + watching scss/html files.
gulp.task('serve', ['sass'], () => {
  serve(done);

  gulp.watch(PATHS.sassPattern, ['sass']);
  gulp.watch(PATHS.htmlPattern).on('change', reload);
});

/**
 * Sass task for live injecting into all browsers.
 * Compiles sass into CSS.
 */
gulp.task('sass', () =>
  gulp
    .src(PATHS.sassPattern)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(PATHS.jekyllCssFiles))
    .pipe(reload({ stream: true }))
);

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

// Process styles, add vendor-prefixes, minify, then
// output the file to the appropriate location.
gulp.task('build:styles:main', () => {
  return gulp
    .src(`${PATHS.sassFiles}/main.scss`)
    .pipe(
      sass({
        outputStyle: 'compressed',
        trace: true,
        loadPath: [PATHS.sassFiles],
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(PATHS.jekyllCssFiles))
    .pipe(gulp.dest(PATHS.siteCssFiles))
    .pipe(browserSync.stream())
    .on('error', logger);
});

// Create and process critical CSS file to be included in head
gulp.task('build:styles:critical', () => {
  return gulp
    .src(`${PATHS.sassFiles}/critical.scss`)
    .pipe(
      sass({
        outputStyle: 'compressed',
        trace: true,
        loadPath: [PATHS.sassFiles],
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('_includes'))
    .pipe(browserSync.stream())
    .on('error', logger);
});

// Build all styles
gulp.task(
  'build:styles',
  gulp.series(['build:styles:main', 'build:styles:critical'])
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
gulp.task('build:jekyll', (callback) => {
  const shellCommand = 'bundle exec jekyll build --config _config.yml';
  run(shellCommand);
  callback();
});

// Delete the entire _site directory
gulp.task('clean:jekyll', (callback) => {
  del([PATHS.siteDir]);
  callback();
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
  gulp.series('build:jekyll:local', (callback) => {
    browserSync.reload();
    callback();
  })
);

// gulp.task('build:scripts:watch', gulp.series('build:scripts', (callback) => {
//   browserSync.reload();
//   callback();
// }));

// Build site
gulp.task(
  'build',
  gulp.series([
    // 'build:scripts',
    'build:styles',
    'build:images',
    // 'build:fonts',
    // 'build:downloads',
    'build:jekyll',
  ])
);

// Serve site and watch files
gulp.task(
  'serve',
  gulp.series('build', (callback) => {
    browserSync.init({
      server: PATHS.siteDir,
      ghostMode: false, // Toggle to mirror clicks, reloads etc (performance)
      logFileChanges: true,
      logLevel: 'debug',
      open: true, // Toggle to auto-open page when starting
    });

    gulp.watch('_config.yml', gulp.series('build:jekyll:watch'));
    // Watch .scss files and pipe changes to browserSync
    gulp.watch('_assets/styles/**/*.scss', gulp.series('build:styles'));
    // Watch .js files
    // gulp.watch('_assets/js/**/*.js', gulp.series('build:scripts:watch'));
    // Watch image files and pipe changes to browserSync
    // gulp.watch('_assets/img/**/*', gulp.series('build:images'));
    // Watch posts
    gulp.watch(
      '_posts/**/*.+(md|markdown|MD)',
      gulp.series('build:jekyll:watch')
    );

    // Watch drafts if --drafts flag was passed
    if (module.exports.drafts) {
      gulp.watch(
        '_drafts/*.+(md|markdown|MD)',
        gulp.series('build:jekyll:watch')
      );
    }

    // Watch html and markdown files
    gulp.watch(
      ['**/*.+(html|md|markdown|MD)', '!_site/**/*.*'],
      gulp.series('build:jekyll:watch')
    );

    // Watch RSS feed
    gulp.watch('feed.xml', gulp.series('build:jekyll:watch'));

    // Watch data files
    gulp.watch(
      '_data/**.*+(yml|yaml|csv|json)',
      gulp.series('build:jekyll:watch')
    );

    callback();
  })
);

// Delete CSS
gulp.task('clean:styles', (callback) => {
  del([
    `${PATHS.jekyllCssFiles}main.css`,
    `${PATHS.siteCssFiles}main.css`,
    '_includes/critical.css',
  ]);
  callback();
});

// // Delete processed JS
// gulp.task('clean:scripts', (callback) => {
//   del([`${PATHS.jekyllJsFiles}main.js', `$PATHS.siteJsFiles}main.js`]);
//   callback();
// });

// // Delete processed images
// gulp.task('clean:images', (callback) => {
//   del([PATHS.jekyllImageFiles, PATHS.siteImageFiles]);
//   callback();
// });

// // Delete processed font files
// gulp.task('clean:fonts', (callback) => {
//   del([PATHS.jekyllFontFiles, PATHS.siteFontFiles]);
//   callback();
// });

// Delete the entire _site directory
gulp.task('clean:jekyll', (callback) => {
  del([PATHS.siteDir]);
  callback();
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
