// Based on https://github.com/waitingsong/base64/blob/master/src/lib/from_buffer.ts
// prevent `Unsupported environment: `window.btoa` or `Buffer` should be supported.`

const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('')

export function toBase64(input: string | ArrayBufferLike | ArrayBufferView | Uint8Array): string {
  if (typeof input === 'string') {
    return fromUint8Array(new TextEncoder().encode(input))
  }

  if (input instanceof Uint8Array) {
    return fromUint8Array(input)
  }

  return fromUint8Array(new Uint8Array(ArrayBuffer.isView(input) ? input.buffer : input))
}

function fromUint8Array(input: Uint8Array): string {
  const extraBytes = input.byteLength % 3 // if we have 1 byte left, pad 2 bytes
  const length = input.byteLength - extraBytes
  let result = ''

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (let index = 0; index < length; index += 3) {
    result += tripletToBase64((input[index] << 16) | ((input[index + 1] << 8) | input[index + 2]))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    const tmp = input[length]
    result += lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + '=='
  } else if (extraBytes === 2) {
    const tmp = (input[length] << 8) | input[length + 1]
    result += lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3f] + lookup[(tmp << 2) & 0x3f] + '='
  }

  return result
}

function tripletToBase64(pos: number): string {
  return (
    lookup[(pos >> 18) & 0x3f] +
    lookup[(pos >> 12) & 0x3f] +
    lookup[(pos >> 6) & 0x3f] +
    lookup[pos & 0x3f]
  )
}
