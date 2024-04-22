// * The contents of this file should work on as many versions of Node.js as
// * possible. Hence, it _cannot_ use any >ES5 syntax or features. Other files,
// * which may use >=ES2015 syntax, should only be loaded asynchronously _after_
// * successful completion of this version check.
//------------------------------------------------------------------------------

/**
 * @file Check Package Engines Task.
 * This task helps ensure a device's active toolchain satisfies version criteria
 * specified in the "engines" field of our package manifest file by verifying
 * that the following system-level constraints are met beforehand.
 * - version of node capable of properly running our program
 * - version of npm & pnpm capable of properly installing our program
 * @author The OpenINF Authors and friends
 * @license MIT
 * @module {CjsModule} tasks/check-package-engines
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
// * Since this module supports a pre-installation task, neither dependencies
// * nor devDependencies specified in our package manifest are installed yet.
// * Therefore, realistically, only the following modules would be available.
// * - core modules built into the currently active version (?) of Node.js
// * - dependencies of the globally-installed version (?) of the `npm` package
// * - our low-level task utils module (compatible with Node.js 6+)
//------------------------------------------------------------------------------

const NODE_DISTRIBUTIONS_URL = 'https://nodejs.org/dist/index.json';
const assert = require('node:assert');

// Ensure we've received a package manifest filepath as the first argument.
assert(
  process.argv.length >= 3, // 1st argument is 3rd for argv.
  'Unmet expectation: filepath argument passed for package.json to be parsed'
);

const packageFilePath = process.argv[2];
const taskUtil = require('./util.js');

// * We are intentionally checking engines are satisfied prior to
// * installation because we aren't yet sure system-level constraint
// * criteria, namely specified version availability for the
// * tools in our Node.js toolchain are satisfied. As such, we don't
// * use them until we are sure...

const rootNpmRequire = taskUtil.rootNpmRequire;
const semver = rootNpmRequire('semver');
const colors = rootNpmRequire('ansicolors');

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Checks the toolchain versions and returns a results object.
 * @param {!string} toolCommand
 * @return {!Object}
 */
const checkVersion = (exports.checkVersion = (toolCommand) => {
  let activeVersion;
  try {
    activeVersion = taskUtil.getTrimmedStdout(`${toolCommand} --version`);
  } catch (err) {
    assert(false, err);
  }
  activeVersion = semver.clean(activeVersion);
  const supportedSemVer =
    taskUtil.getPackageEngines(packageFilePath)[toolCommand];
  // Accommodate for labels and build metadata appearing as SemVer extensions.
  const activeVersionNoPrerelease = activeVersion.replace(/-.*$/, '');
  return {
    command: toolCommand,
    required: supportedSemVer,
    version: activeVersionNoPrerelease,
    supported: semver.satisfies(activeVersionNoPrerelease, supportedSemVer),
  };
});

/**
 * Process version check results and print a warning if unsupported.
 * @param {!Object} result
 * @return {!number}
 */
const processVersionCheckResults = (result) => {
  if (!result.supported) {
    console.error(
      colors.red(`× ${result.command}\t v${semver.clean(result.version)}`)
    );
    return 1;
  }
  console.error(
    colors.green(`○ ${result.command}\t v${semver.clean(result.version)}`)
  );
  return 0;
};

/**
 * Print a recommendation and kill process if any unsupported.
 * @param {!Object} error
 * @param {!string} version
 */
const errorCallback = (error, version) => {
  if (!version) {
    console.error(colors.red(error));
  } else {
    const newlineMarker = require('node:os').EOL;
    console.error(
      newlineMarker +
        colors.yellow('WARNING: Detected missing/unsupported tool!')
    );
    const errorMessage = [
      colors.yellow('Remedy this by running ') +
        colors.cyan(`"nvm install ${semver.clean(version)}"`) +
        colors.yellow(' or'),
      colors.yellow('see ') +
        colors.cyan('https://nodejs.org/en/download/package-manager') +
        colors.yellow(' for instructions.'),
    ].join(newlineMarker);
    console.error(errorMessage);
    process.exit(1);
  }
};

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

exports.default = (() => {
  console.error('   Main Engines');
  console.error('------------------');
  const packageEngines = taskUtil.getPackageEngines(packageFilePath);
  const versionCheckResults = Object.keys(packageEngines).map((value) => {
    return checkVersion(value);
  });
  const supportedSemVer = taskUtil.getPackageEngines(packageFilePath).node;
  const redResults = versionCheckResults.map((value) => {
    return processVersionCheckResults(value);
  });
  if (redResults.includes(1)) {
    taskUtil.getLatestNodejsVersion(
      errorCallback,
      NODE_DISTRIBUTIONS_URL,
      supportedSemVer
    );
  }
})();
