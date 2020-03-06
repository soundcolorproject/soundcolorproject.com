
function leftPad(num) {
  return num.length > 1 ? num : `0${num}`
}

export function hexToHsv(hex) {
  let r, g, b
  let h, s, v
  if (!hex.startsWith('#')) {
    return null
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16) / 255
    g = parseInt(hex.substring(3, 5), 16) / 255
    b = parseInt(hex.substring(5, 7), 16) / 255
  } else if (hex.length === 4) {
    r = parseInt(hex[1], 16) / 16
    g = parseInt(hex[2], 16) / 16
    b = parseInt(hex[3], 16) / 16
  }
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  if (max === r) {
    h = (6 + ((g - b) / delta)) % 6
  } else if (max === g) {
    h = 2 + ((b - r) / delta)
  } else if (max === b) {
    h = 4 + ((r - g) / delta)
  }
  h *= 60
  if (max === 0) {
    s = 0
  } else {
    s = delta / max
  }
  v = max

  return { h, s, v }
}

export function hsvToHex ({ h, s, v }) {
  const min = v - (v * s)
  const max = v * s + min
  const mid = v * s * (1 - Math.abs(((h / 60) % 2) - 1)) + min
  let r, g, b
  if (h < 60) {
    r = max
    g = mid
    b = min
  } else if (h < 120) {
    r = mid
    g = max
    b = min
  } else if (h < 180) {
    r = min
    g = max
    b = mid
  } else if (h < 240) {
    r = min
    g = mid
    b = max
  } else if (h < 300) {
    r = mid
    g = min
    b = max
  } else {
    r = max
    g = min
    b = mid
  }
  r = leftPad(Math.floor(r * 255).toString(16))
  g = leftPad(Math.floor(g * 255).toString(16))
  b = leftPad(Math.floor(b * 255).toString(16))

  return `#${r}${g}${b}`
}
