/* eslint-env node, browser */
import type { AppProps } from 'next/app'
import type { BaseTheme, TwindConfig, TwindUserConfig, Preset } from 'twind'

import { createElement } from 'react'
import { install as install$ } from 'twind'

export default install

function install<Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
): React.JSXElementConstructor<AppProps>

function install<Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config: TwindUserConfig<Theme, Presets>,
): React.JSXElementConstructor<AppProps>

function install<Props, Component, Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
  AppComponent: React.JSXElementConstructor<Props> & Component,
): Component

function install<Props, Component, Theme = BaseTheme, Presets extends Preset<any>[] = Preset[]>(
  config: TwindUserConfig<Theme, Presets>,
  AppComponent: React.JSXElementConstructor<Props> & Component,
): Component

function install<Props, Component>(
  config: TwindConfig | TwindUserConfig,
  AppComponent: React.JSXElementConstructor<Props> & Component,
): Component

function install<Props, Component>(
  config: TwindConfig | TwindUserConfig,
  AppComponent: React.JSXElementConstructor<Props> & Component = TwindApp as any,
): Component {
  install$(config as TwindUserConfig, process.env.NODE_ENV != 'production')

  return AppComponent
}

function TwindApp(props: AppProps) {
  return createElement(props.Component, props.pageProps)
}
