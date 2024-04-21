/**
 * @file Verify JavaScript files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {ES6Module} build/tasks/verify/verify-js.mjs
 */

import { execute } from '@yarnpkg/shell';
import { globby } from 'globby';

const JSFiles = await globby([
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
