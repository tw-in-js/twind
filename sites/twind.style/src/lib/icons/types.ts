export interface IconSource {
  viewbox?: string
  fill?: string
  stroke?: string
  paths?: Record<string, string>[]
  rects?: Record<string, string>[]
  circles?: Record<string, string>[]
  polygons?: Record<string, string>[]
  lines?: Record<string, string>[]
}
