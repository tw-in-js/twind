/**
 *
 * @param {import('typedoc').Application} app
 */
exports.load = function (app) {
  app.renderer.defineTheme('twind', require('./theme.cjs').TwindTheme)
}
