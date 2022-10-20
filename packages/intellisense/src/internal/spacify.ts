export function spacify(value: string): string {
  return (value[0] === '-' ? '- ' : '') + value.replace(/[-\s]+/g, ' ')
}
