import type { Workspace } from "$lib/types"

import config from "./config.tpl?raw"
import html from "./html.tpl?raw"
import script from "./script.tpl?raw"

export const workspace: Workspace = {
  version: "*",
  html: { path: "index.html", value: html },
  script: { path: "index.ts", value: script },
  config: { path: "twind.config.ts", value: config },
}
