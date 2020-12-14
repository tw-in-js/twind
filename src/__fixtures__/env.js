/* eslint-env node */

require('esbuild-register')

// Node's error-message stack size is limited at 10, but it's pretty useful
// to see more than that when a test fails.
Error.stackTraceLimit = 100

process.env.NODE_ENV = 'test'
