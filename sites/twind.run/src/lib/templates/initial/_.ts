import config from "./twind.config.ts?raw"
import html from "./index.html?raw"
import script from "./index.ts?raw"
import type { Workspace } from "$lib/types"

const template: Workspace = {
  version: "*",
  html: { path: "index.html", value: html },
  script: { path: "index.js", value: script },
  config: { path: "twind.config.ts", value: config },
}

export default template
