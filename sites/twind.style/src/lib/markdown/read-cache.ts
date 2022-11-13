import { resolve } from 'node:path'
import { promisify } from 'node:util'

import fs from 'graceful-fs'
import matter, { type GrayMatterFile } from 'gray-matter'

import QuickLRU from 'quick-lru'

const stat = promisify(fs.stat)
const read = promisify(fs.readFile)

const cache = new QuickLRU<
  string,
  { mtime: Date; file: GrayMatterFile<string> & { path: string } }
>({ maxSize: 500 })

export async function readFile(path: string): Promise<GrayMatterFile<string>> {
  path = resolve(path)

  const stats = await stat(path)

  let cached = cache.get(path)

  if (cached?.mtime.getTime() !== stats.mtime.getTime()) {
    cache.set(
      path,
      (cached = {
        mtime: stats.mtime,
        file: Object.assign(matter(await read(path, { encoding: 'utf8' })), { path }),
      }),
    )
  }

  return cached.file
}
