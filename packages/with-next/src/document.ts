/* eslint-env node */
import type { DocumentContext, DocumentInitialProps } from 'next/document'

import { createElement, Fragment } from 'react'
import Document from 'next/document'
import { extract } from 'twind'

export default install

function install(): typeof Document
function install<Component extends typeof Document = typeof Document>(
  DocumentComponent: Component,
): Component

function install<Component extends typeof Document = typeof Document>(
  BaseComponent: Component = Document as Component,
): Component {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return class TwindDocument extends BaseComponent {
    static getInitialProps(
      ctx: DocumentContext & {
        defaultGetInitialProps: (
          ctx: DocumentContext,
          options?: { nonce?: string },
        ) => Promise<DocumentInitialProps>
      },
    ) {
      const defaultGetInitialProps = ctx.defaultGetInitialProps.bind(ctx)

      ctx.defaultGetInitialProps = async (ctx, options: { nonce?: string } = {}) => {
        const props = await defaultGetInitialProps(ctx, options)

        const { html, css } = extract(props.html)

        const styles = createElement(
          Fragment,
          null,
          createElement('style', {
            'data-twind': '',
            nonce: options.nonce,
            dangerouslySetInnerHTML: {
              __html: css,
            },
          }),
          props.styles,
        )

        return { ...props, html, styles }
      }

      return BaseComponent.getInitialProps(ctx)
    }
  }
}
