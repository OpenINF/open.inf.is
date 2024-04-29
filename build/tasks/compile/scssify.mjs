/**
 * @file Main SCSS task; convert SCSS source assets into CSS:
 * - supports PostCSS
 * - handles source maps
 * - compatible/functional Gulp task
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/scssify
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
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(PATHS.jekyllCssFiles))
    .pipe(dest(PATHS.siteCssFiles));

  done(null);
}

export default scssify;
