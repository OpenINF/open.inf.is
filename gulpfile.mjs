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

import { basename as pathBasename } from 'node:path';
import { PATHS } from '@openinf/portal/build/constants';
import { glob } from '@openinf/portal/build/utils';
import gulp from 'gulp';

const tasks = await glob([`./${PATHS.gulpTasksDir}*.mjs`]);

for (const task of tasks) {
  const taskName = pathBasename(task, '.mjs');
  const taskModule = await import(task);
  gulp.task(taskName, taskModule.default);
}
