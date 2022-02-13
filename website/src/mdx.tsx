// https://opstrace.com/blog/nextjs-on-cloudflare

import Image from '~/image'

export function Img({
  alt,
  src,
  placeholder,
  ...props
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  return src && (placeholder == 'blur' || placeholder == 'empty') ? (
    <Image src={src} alt={alt} layout="responsive" placeholder={placeholder} {...props} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  )
}

// TODO https://www.mdx-embed.com/?path=/docs/mdx-embed--page
export const components: import('mdx/types').MDXComponents = {
  // Pass a layout (using the special `'wrapper'` key).
  // wrapper: ({ components, ...rest }) => <div className="prose" {...rest} />,

  // https://mdxjs.com/table-of-components/
  img: Img,

  // h1: ({
  //   children,
  //   ...props
  // }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  //   <h1 className="scroll-pt-20" {...props}>
  //     {children}
  //   </h1>
  // ),
}
