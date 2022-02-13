// Based on https://opstrace.com/blog/nextjs-on-cloudflare
import Img from 'next/image'

function normalizeSrc(src: string): string {
  return src.startsWith('/') ? src.slice(1) : src
}

export type ImageProps = import('next/image').ImageLoaderProps & {
  height?: number
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
  gravity?:
    | 'auto'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | `${'0' | '1' | `0.${number}`}x${'0' | '1' | `0.${number}`}`
  format?: 'auto' | 'png' | 'jpg' | 'jpeg' | 'gif' | 'avif' | 'webp'
  anim?: false
  blur?: number
}

// https://developers.cloudflare.com/images/image-resizing/url-format
export function loader({
  src,
  width,
  height,
  quality,
  fit = 'scale-down',
  gravity = 'auto',
  format = 'auto',
  anim,
  blur,
}: ImageProps): string {
  const params = [
    `width=${width},fit=${fit},gravity=${gravity},format=${format}`,
    height && `height=${height}`,
    quality && `quality=${quality}`,
    anim && `anim=${anim}`,
    blur && `blur=${blur}`,
  ].filter(Boolean)

  return `/cdn-cgi/image/${params}/${normalizeSrc(src)}`
}

export default function Image(props: ImageProps) {
  if (process.env.NODE_ENV === 'development') {
    return <Img unoptimized={true} {...props} />
  } else {
    return <Img {...props} loader={loader} />
  }
}
