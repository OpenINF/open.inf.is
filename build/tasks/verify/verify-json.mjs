/**
 * @file Verify JSON files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-js
 */

import yarnpkgShell from '@yarnpkg/shell';
import { pathsfromGlobs } from '../../utils.mjs';

let code = 0;
const scripts = [
  'npx eslint --ext=.json .', // validate
  'npx prettier -c {*.json,.*.json}', // style-check
];

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
