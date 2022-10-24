import { dev } from '$app/environment'

// https://developers.cloudflare.com/images/image-resizing/url-format
export interface CloudflareImageProps {
  /**
   * An absolute path on the origin server, or an absolute URL (starting with `https://` or `http://`),
   * pointing to an image (JPEG, PNG, GIF (including animations), and WebP) to resize.
   *
   * @link https://developers.cloudflare.com/images/image-resizing/url-format
   */
  src: string

  /**
   * Specifies maximum width of the image in pixels. Exact behavior depends on the `fit`Ï mode (described below).
   */
  width?: string | number | undefined

  /**
   * Specifies maximum height of the image in pixels. Exact behavior depends on the `fit` mode (described below).
   */
  height?: string | number | undefined

  /**
   * Device Pixel Ratio. Default is `1`. Multiplier for `width`/`height` that makes it easier to specify higher-DPI sizes in `<img srcset>`.
   */
  dpr?: string | number | undefined

  /**
   * Affects interpretation of `width` and `height`. All resizing modes preserve aspect ratio. Available modes are:
   *
   * - `scale-down`: Image will be shrunk in size to fully fit within the given `width` or `height`, but will not be enlarged.
   * - `contain`: Image will be resized (shrunk or enlarged) to be as large as possible within the given `width` or `height` while preserving the aspect ratio.
   * - `cover`: Image will be resized to exactly fill the entire area specified by `width` and `height`, and will cropped if necessary.
   * - `crop`: Image will be shrunk and cropped to fit within the area specified by `width` and `height`. The image will not be enlarged.
   *           For images smaller than the given dimensions it is the same as `scale-down`.
   *           For images larger than the given dimensions, it is the same as `cover`.
   * - `pad`: Image will be resized (shrunk or enlarged) to be as large as possible within the given `width` and `height` while preserving the aspect ratio,
   *          and the extra area will be filled with a background color (white by default). Transparent background may be very expensive,
   *          and it is better to use `contain` and CSS `object-fit: contain` property instead.
   */
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'

  /**
   * Cropping with `fit=cover` specifies the most important side or point in the image that should not be cropped off.
   */
  gravity?:
    | 'auto'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | `${'0' | '1' | `0.${number}`}x${'0' | '1' | `0.${number}`}`
    | undefined

  /**
   * Specifies quality for images in JPEG, WebP, and AVIF formats (`85` is the default). The quality is in a 1-100 scale,
   * but useful values are between `50` (low quality, small file size) and `90` (high quality, large file size).
   * When using the PNG format, an explicit quality setting allows use of PNG8 (palette) variant of the format.
   */
  quality?: string | number | undefined

  /**
   * Allows serving of the WebP or AVIF format to browsers that support it. If this option is not specified, a standard format like JPEG or PNG will be used.
   */
  format?: 'auto' | 'png' | 'jpeg' | 'gif' | 'avif' | 'webp' | undefined

  /**
   * Reduces animations to still images. This setting is recommended to avoid large animated GIF files, or flashing images.
   */
  anim?: 'false' | false | undefined

  /**
   * Specifies strength of sharpening filter. The value is a floating-point number between `0` (no sharpening) and `10` (maximum). `1` is a recommended value.
   */
  sharpen?: string | number | undefined

  /**
   * Blur radius between `1` (slight blur) and `250` (maximum). Be aware that you cannot use this option to reliably obscure image content,
   * because savvy users can modify an image's URL and remove the blur option.
   */
  blur?: string | number | undefined

  /**
   * Controls amount of invisible metadata (EXIF data) that should be preserved. Color profiles and EXIF rotation are applied to the image
   * even if the metadata is discarded.
   */
  metadata?: 'keep' | 'copyright' | 'none' | undefined
}

export function img({
  src,
  width,
  height,
  dpr,
  fit = 'contain',
  quality,
  gravity,
  format,
  anim,
  sharpen,
  blur,
  metadata,
}: CloudflareImageProps): string {
  if (dev) {
    return src
  }

  const params = [
    width && `w=${width}`,
    height && `h=${height}`,
    dpr && `dpr=${dpr}`,
    `fit=${fit}`,
    gravity && `q=${gravity}`,
    quality && `q=${quality}`,
    format && `f=${format}`,
    anim && `anim=${anim}`,
    sharpen && `sharpen=${sharpen}`,
    blur && `blur=${blur}`,
    metadata && `metadata=${metadata}`,
  ].filter(Boolean)

  return `/cdn-cgi/image/${params}/${normalizeSrc(src)}`
}

function normalizeSrc(src: string): string {
  return src.startsWith('/') ? src.slice(1) : src
}
