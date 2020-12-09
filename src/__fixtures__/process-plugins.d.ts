export declare function processPlugins(): {
  screens: Record<string, string>
  variants: string[]
  directives: Record<string, { selector: string; properties: Record<string, string> }>
  darkMode: false | 'media' | 'class'
  prefix: string
  separator: string
}
