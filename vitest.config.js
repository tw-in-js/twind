import isCI from 'is-ci'

export default {
  test: {
    coverage: {
      reporter: isCI ? 'lcovonly' : 'html',
    },
    api: { port: 3002 },
  },
}
