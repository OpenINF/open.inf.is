/**
 * @file Format Markdown files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-md
 */

import { execute } from '@yarnpkg/shell';
import { pathsfromGlobs } from '../../utils.mjs';

const MarkdownFiles = await pathsfromGlobs([
  '**.md',
  '!_site/',
  '!node_modules/',
  '!vendor/',
  '!**/COPYING.md',
]);

let exitCode = 0;
const scripts = [
  `biome format ${MarkdownFiles.join(' ')}`,
  `markdownlint-cli2 --fix ${MarkdownFiles.join(' ')}`,
];

for await (const element of scripts) {
  try {
    exitCode = await execute(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
