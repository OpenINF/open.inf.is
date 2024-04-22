/**
 * @file Verify Markdown files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {ES6Module} build/tasks/verify/verify-md
 */

import { execute, glob } from '@openinf/site/build/utils';

const MarkdownFiles = await pathsfromGlobs([
  '**.md',
  '!_site/',
  '!node_modules/',
  '!vendor/',
  '!**/COPYING.md',
]);

let exitCode = 0;
const scripts = [
  `biome lint ${MarkdownFiles.join(' ')}`,
  `markdownlint-cli2 ${MarkdownFiles.join(' ')}`,
  `remark -f ${MarkdownFiles.join(' ')}`,
  `cspell check ${MarkdownFiles.join(' ')}`,
];

for (const element of scripts) {
  try {
    exitCode = await execute(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
