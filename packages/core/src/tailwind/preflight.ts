// Source: https://github.com/sindresorhus/modern-normalize/blob/master/modern-normalize.css
// License: MIT

// Source: https://github.com/tailwindlabs/tailwindcss/blob/master/src/plugins/css/preflight.css
// License: MIT

import type { CSSRules, ThemeResolver } from '@tw-in-js/types'

/**
 * Manually forked from SUIT CSS Base: https://github.com/suitcss/base
 * A thin layer on top of normalize.css that provides a starting point more
 * suitable for web applications.
 */
export const createPreflight = (theme: ThemeResolver): CSSRules => ({
  /**
   * Use a more readable tab size (opinionated).
   */
  ':root': { tabSize: 4 },

  /**
   * Removes the default spacing and border for appropriate elements.
   */
  'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre': { margin: '0' },

  button: { backgroundColor: 'transparent', backgroundImage: 'none' },
  /**
   * Correct the inability to style clickable types in iOS and Safari.
   */
  'button,[type="button"],[type="reset"],[type="submit"]': { WebkitAppearance: 'button' },

  /**
   * Work around a Firefox/IE bug where the transparent `button` background
   * results in a loss of the default `button` focus styles.
   */
  'button:focus': { outline: ['1px dotted', '5px auto -webkit-focus-ring-color'] },

  fieldset: { margin: '0', padding: '0' },

  'ol,ul': { listStyle: 'none', margin: '0', padding: '0' },

  /**
   * 1. Use Tailwind's default "normal" line-height so the user isn't forced
   *    to override it to ensure consistency even when using the default theme.
   * 2. Prevent adjustments of font size after orientation changes in iOS.
   * 3. Use the user's configured `sans` font-family (with Tailwind's default
   *    sans-serif font stack as a fallback) as a sane default.
   */
  html: {
    lineHeight: '1.5',
    WebkitTextSizeAdjust: '100%',
    fontFamily: theme('fontFamily', 'sans', 'ui-sans-serif,system-ui,sans-serif'),
  },

  /**
   * 1. Remove the margin in all browsers.
   * 2. Inherit font-family and line-height from `html` so users can set them as
   * a class directly on the `html` element.
   */
  body: { margin: '0', fontFamily: 'inherit', lineHeight: 'inherit' },

  /**
   * 1. Prevent padding and border from affecting element width.
   *
   *    We used to set this in the html element and inherit from
   *    the parent element for everything else. This caused issues
   *    in shadow-dom-enhanced elements like <details> where the content
   *    is wrapped by a div with box-sizing set to `content-box`.
   *
   *    https://github.com/mozdevs/cssremedy/issues/4
   *
   *
   * 2. Allow adding a border to an element by just adding a border-width.
   *
   *    By default, the way the browser specifies that an element should have no
   *    border is by setting it's border-style to `none` in the user-agent
   *    stylesheet.
   *
   *    In order to easily add borders to elements by just setting the `border-width`
   *    property, we change the default border-style for all elements to `solid`, and
   *    use border-width to hide them instead. This way our `border` utilities only
   *    need to set the `border-width` property instead of the entire `border`
   *    shorthand, making our border utilities much more straightforward to compose.
   *
   *    https://github.com/tailwindcss/tailwindcss/pull/116
   */
  '*,::before,::after': {
    boxSizing: 'border-box',
    border: `0 solid ${theme('borderColor', 'DEFAULT', 'currentColor')}`,
  },

  /*
   * 1. Add the correct height in Firefox.
   * 2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
   * 3. Ensure horizontal rules are visible by default
   */
  hr: { height: '0', color: 'inherit', borderTopWidth: '1px' },

  /**
   * Undo the `border-style: none` reset that Normalize applies to images so that
   * our `border-{width} utilities have the expected effect.
   *
   * The Normalize reset is unnecessary for us since we default the border-width
   * to 0 on all elements.
   *
   * https://github.com/tailwindcss/tailwindcss/issues/362
   */
  img: { borderStyle: 'solid' },

  textarea: { resize: 'vertical' },

  'input::placeholder,textarea::placeholder': {
    color: theme('placeholderColor', 'DEFAULT', '#a1a1aa'),
  },

  'button,[role="button"]': { cursor: 'pointer' },

  /**
   * 1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
   * 2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
   */
  table: { textIndent: '0', borderColor: 'inherit', borderCollapse: 'collapse' },

  'h1,h2,h3,h4,h5,h6': { fontSize: 'inherit', fontWeight: 'inherit' },

  /**
   * Reset links to optimize for opt-in styling instead of
   * opt-out.
   */
  a: { color: 'inherit', textDecoration: 'inherit' },

  /**
   * 1. Change the font styles in all browsers.
   * 2. Remove the margin in Firefox and Safari.
   * Reset form element properties that are easy to forget to
   * style explicitly so you don't inadvertently introduce
   * styles that deviate from your design system. These styles
   * supplement a partial reset that is already applied by
   * normalize.css.
   */
  'button,input,optgroup,select,textarea': {
    fontFamily: 'inherit',
    fontSize: '100%',
    margin: '0',
    padding: '0',
    lineHeight: 'inherit',
    color: 'inherit',
  },

  /**
   * Remove the inheritance of text transform in Edge and Firefox.
   * 1. Remove the inheritance of text transform in Firefox.
   */
  'button,select': { textTransform: 'none' },

  /**
   * Remove the inner border and padding in Firefox.
   */
  '::-moz-focus-inner': { borderStyle: 'none', padding: '0' },

  /**
   * Restore the focus styles unset by the previous rule.
   */
  ':-moz-focusring': { outline: '1px dotted ButtonText' },

  /**
   * Remove the additional ':invalid' styles in Firefox.
   * See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
   */
  ':-moz-ui-invalid': { boxShadow: 'none' },

  /**
   * Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
   */

  legend: { padding: '0' },

  /**
   * Add the correct vertical alignment in Chrome and Firefox.
   */
  progress: { verticalAlign: 'baseline' },

  /**
   * Correct the cursor style of increment and decrement buttons in Safari.
   */
  '::-webkit-inner-spin-button,::-webkit-outer-spin-button': { height: 'auto' },

  /**
   * 1. Correct the odd appearance in Chrome and Safari.
   * 2. Correct the outline style in Safari.
   */
  '[type="search"]': { WebkitAppearance: 'textfield', outlineOffset: '-2px' },

  /**
   * Remove the inner padding in Chrome and Safari on macOS.
   */
  '::-webkit-search-decoration': { WebkitAppearance: 'none' },

  /**
   * 1. Correct the inability to style clickable types in iOS and Safari.
   * 2. Change font properties to 'inherit' in Safari.
   */
  '::-webkit-file-upload-button': { WebkitAppearance: 'button', font: 'inherit' },

  /*
   * Add the correct display in Chrome and Safari.
   */
  summary: { display: 'list-item' },

  /**
   * Add the correct text decoration in Chrome, Edge, and Safari.
   */
  'abbr[title]': { textDecoration: 'underline dotted' },

  /**
   * Add the correct font weight in Edge and Safari.
   */
  'b,strong': { fontWeight: 'bolder' },

  /**
   * 1. Use the configured 'mono' font family for elements that
   * are expected to be rendered with a monospace font, falling
   * back to the system monospace stack if there is no configured
   * 'mono' font family.
   * 2. Correct the odd 'em' font sizing in all browsers.
   */
  'pre,code,kbd,samp': {
    fontFamily: theme('fontFamily', 'mono', 'ui-monospace,monospace'),
    fontSize: '1em',
  },

  /**
   * Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
   */
  'sub,sup': { fontSize: '75%', lineHeight: '0', position: 'relative', verticalAlign: 'baseline' },

  sub: { bottom: '-0.25em' },

  sup: { top: '-0.5em' },

  /**
   * Make replaced elements `display: block` by default as that's
   * the behavior you want almost all of the time. Inspired by
   * CSS Remedy, with `svg` added as well.
   *
   * https://github.com/mozdevs/cssremedy/issues/14
   */
  'img,svg,video,canvas,audio,iframe,embed,object': { display: 'block', verticalAlign: 'middle' },

  /**
   * Constrain images and videos to the parent width and preserve
   * their instrinsic aspect ratio.
   *
   * https://github.com/mozdevs/cssremedy/issues/14
   */
  'img,video': { maxWidth: '100%', height: 'auto' },
})
