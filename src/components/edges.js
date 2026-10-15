// Bordes de papel cortado (como el envoltorio de una tableta), hechos con clip-path.
export function zigzag({ teeth = 24, depth = 14, top = false, bottom = true } = {}) {
  const pts = []
  const step = 100 / teeth
  if (top) {
    for (let i = 0; i <= teeth; i++) pts.push(`${(i * step).toFixed(2)}% ${i % 2 ? depth : 0}px`)
  } else {
    pts.push('0 0', '100% 0')
  }
  if (bottom) {
    for (let i = teeth; i >= 0; i--) pts.push(`${(i * step).toFixed(2)}% calc(100% - ${i % 2 ? 0 : depth}px)`)
  } else {
    pts.push('100% 100%', '0 100%')
  }
  return { clipPath: `polygon(${pts.join(', ')})` }
}
