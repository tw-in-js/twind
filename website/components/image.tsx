// Based on https://opstrace.com/blog/nextjs-on-cloudflare
import Img from 'next/image'

function normalizeSrc(src: string): string {
  return src.startsWith('/') ? src.slice(1) : src
}

// https://developers.cloudflare.com/images/image-resizing/url-format
function cloudflareImageLoader({
  src,
  width,
  quality,
}: import('next/image').ImageLoaderProps): string {
  const params = [`width=${width}`]

  if (quality) {
    params.push(`quality=${quality}`)
  }

  return `/cdn-cgi/image/${params}/${normalizeSrc(src)}`
}

export default function Image(props: import('next/image').ImageProps) {
  if (process.env.NODE_ENV === 'development') {
    return <Img unoptimized={true} {...props} />
  } else {
    return <Img {...props} loader={cloudflareImageLoader} />
  }
}
