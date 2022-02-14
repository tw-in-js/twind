// https://opstrace.com/blog/nextjs-on-cloudflare

import Link from 'next/link'
import { cx } from 'twind'
import Image from '~/image'

// TODO https://www.mdx-embed.com/?path=/docs/mdx-embed--page
export const components: import('mdx/types').MDXComponents = {
  // Pass a layout (using the special `'wrapper'` key).
  // wrapper: ({ components, ...rest }) => <div className="prose" {...rest} />,

  a: function A({ href, ...props }) {
    if (href == null) {
      return <a {...props} />
    }

    // anchor
    if (href.startsWith('#')) {
      if (props.className === 'autolink') {
        props = {
          ...props,
          className: cx`
            all[inherit] cursor-pointer flex items-center -ml-12 pl-[4.125rem]
            before:(
              invisible cursor-pointer flex items-center justify-center -ml-12 mr-2 h-5 w-5
              text-brand-11 text-sm content-['#']
              ring(1 brand-7) rounded-md shadow-sm
            )
            hover:before:(visible shadow dark:(bg-brand-4-dark ring-0 shadow-none))`,
        }
      }

      return <a {...props} href={href} />
    }

    // external link
    if (href.startsWith('http')) {
      return <a {...props} href={href} rel="nofollow noopener noreferrer" target="_blank" />
    }

    // internal link
    return (
      <Link href={href} prefetch={false}>
        <a {...props} />
      </Link>
    )
  },
  // https://mdxjs.com/table-of-components/
  img: function Img({ alt, src, placeholder, ...props }) {
    // TODO: https://nextjs.org/docs/api-reference/next/image#placeholder
    // TODO: convert src to StaticImageData
    return src && (placeholder == 'blur' || placeholder == 'empty') ? (
      <Image src={src} alt={alt} layout="responsive" placeholder={placeholder} {...props} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} {...props} />
    )
  },

  // h1: ({
  //   children,
  //   ...props
  // }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  //   <h1 className="scroll-pt-20" {...props}>
  //     {children}
  //   </h1>
  // ),

  // TODO: a: with Link and prefetch={false}
}
