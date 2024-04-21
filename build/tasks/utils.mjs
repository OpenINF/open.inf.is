/**
 * @file Common Build Task Utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/utils
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { execute } from '@yarnpkg/shell';
import { globby } from 'globby';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export const getPathsFromGlobs = async (filePathGlobsArray) => {
  return await globby(filePathGlobsArray);
};

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
