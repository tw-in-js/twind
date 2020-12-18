export const variants: Record<string, string> = {
  ':dark': '@media (prefers-color-scheme:dark)',
  ':sticky': '@supports ((position: -webkit-sticky) or (position:sticky))',
  ':motion-reduce': '@media (prefers-reduced-motion:reduce)',
  ':motion-safe': '@media (prefers-reduced-motion:no-preference)',
  ':first': '&:first-child',
  ':last': '&:last-child',
  ':even': '&:nth-child(2n)',
  ':odd': '&:nth-child(odd)',
  ':children': '&>*',
  ':siblings': '&~*',
}
