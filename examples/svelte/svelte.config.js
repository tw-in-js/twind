const autoPreprocess = require('svelte-preprocess')

module.exports = {
  preprocess: autoPreprocess({
    sourceMap: true,

    defaults: {
      script: 'typescript',
    },

    /**
     * Type checking can be skipped by setting 'transpileOnly: true'.
     * This speeds up your build process.
     *
     * Checking is done using svelte-check
     */
    typescript: {
      transpileOnly: true,
    },
  }),
}
