/* eslint-env node */
import type { PluginOptionsSchemaArgs, CreateWebpackConfigArgs } from 'gatsby'

import { resolve } from 'path'

export function pluginOptionsSchema({
  Joi,
}: PluginOptionsSchemaArgs): ReturnType<PluginOptionsSchemaArgs['Joi']['object']> {
  return Joi.object({
    config: Joi.string().default('twind.config.js').description(`Path to twind config module.`),
  })
}

export function onCreateWebpackConfig(
  { actions }: CreateWebpackConfigArgs,
  { config = 'twind.config.js' }: { config?: string },
): void {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'gatsby-plugin-twind/config$': resolve(process.cwd(), config),
      },
    },
  })
}
