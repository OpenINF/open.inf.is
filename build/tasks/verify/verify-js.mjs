/**
 * @file Verify JavaScript files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-js
 */

import { execute } from '@yarnpkg/shell';
import { filePathGlobs } from '../utils.mjs';

const JSFiles = await filePathGlobs([
  '**.mjs',
  '!_site/',
  '!node_modules/',
  '!vendor/',
]);

let exitCode = 0;
const scripts = [`biome lint ${JSFiles.join(' ')}`];

for (const element of scripts) {
  try {
    exitCode = await execute(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
