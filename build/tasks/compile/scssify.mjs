/**
 * @file Gulp task to compiles main SCSS into CSS.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/gulp/build-main-css
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { PATHS } from '@openinf/portal/build/constants';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { dest, src } from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';

// -----------------------------------------------------------------------------
// Task
// -----------------------------------------------------------------------------

export function scssify(done) {
  src(`${PATHS.sassFiles}/main.scss`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        precision: 10,
        onError: browserSync.notify,
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(PATHS.jekyllCssFiles))
    .pipe(dest(PATHS.siteCssFiles));

  done(null);
}

export default scssify;
