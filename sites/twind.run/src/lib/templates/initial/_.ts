import manifest from "./package.json"
import config from "./twind.config.ts?raw"
import html from "./index.html?raw"
import script from "./index.ts?raw"

export interface File {
  path: string
  value: string
  dirty?: boolean
}

export interface Template {
  html: File
  script: File
  config: File
  manifest: File
}

const template: Template = {
  html: { path: "index.html", value: html },
  script: { path: "index.js", value: script },
  config: { path: "twind.config.ts", value: config },
  manifest: { path: "package.json", value: manifest },
}

export default template
