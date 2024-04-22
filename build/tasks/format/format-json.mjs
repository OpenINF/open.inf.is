/**
 * @file Verify JSON files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-json
 */

import { execute, glob } from '@openinf/site/build/utils';

const JSONFiles = await glob([
  '**.json',
  '**.json5',
  '**.jsonc',
  '!_site/',
  '!node_modules/',
  '!vendor/',
]);

let exitCode = 0;
const scripts = [`biome format --write ${JSONFiles.join(' ')}`];

for (const element of scripts) {
  try {
    exitCode = await execute(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
