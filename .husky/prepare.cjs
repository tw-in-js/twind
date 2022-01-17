// prepare.js
// do not run on CI env and non-git (codesandbox)
const isCI = require('is-ci')
const hasGit = require('fs').existsSync('.git')

if (!isCI && hasGit) {
  require('husky').install()
}
