/**
 * @file Common Build Task Utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/utils
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

export { execute } from '@yarnpkg/shell';
export { globby as glob } from 'globby';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// export const pathsFromGlobs = async (filePathGlobsArray) => {
//   return await globby(filePathGlobsArray);
// };

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
