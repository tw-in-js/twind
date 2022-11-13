import type { Workspace } from "$lib/types"

const templates = import.meta.glob("./*/index.ts")

export const loadDefaultTemplate = () => import("./default")

export async function loadTemplate(id: string): Promise<undefined | { workspace: Workspace }> {
  const template = templates[`./${id}/index.ts`]

  if (template) {
    return (await template()) as { workspace: Workspace }
  }
}
