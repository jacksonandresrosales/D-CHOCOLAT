// Dibujo del empaque de cada producto (no hay fotos de producto todavía).
const C = { red: '#d62b1f', yellow: '#ffc21a', paper: '#f7ecd9', cacao: '#3b1d10' }
const INK = '#1c0d06'
const tinta = (c) => (c === 'red' || c === 'cacao' ? C.paper : INK)

function Tableta({ p }) {
  return (
    <>
      {/* chocolate asomando */}
      <rect x="44" y="18" width="112" height="100" rx="8" fill="#5a2c18" stroke={INK} strokeWidth="5" />
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={52 + c * 34} y={26 + r * 34} width="28" height="28" rx="4" fill="#6f3720" stroke="#3b1d10" strokeWidth="3" />
        )),
      )}
      {/* borde de papel dorado */}
      <path d="M36 104 L46 94 L56 104 L66 94 L76 104 L86 94 L96 104 L106 94 L116 104 L126 94 L136 104 L146 94 L156 104 L166 94 L164 112 L36 112 Z" fill={C.yellow} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="36" y="108" width="128" height="140" rx="6" fill={C[p.wrap]} stroke={INK} strokeWidth="5" />
      <rect x="36" y="196" width="128" height="22" fill={C[p.band]} />
      <text x="100" y="166" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="900" fontSize="44" fill={tinta(p.wrap)}>
        {p.pct}%
      </text>
      <text x="100" y="185" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="600" fontSize="11" fill={tinta(p.wrap)}>
        cacao fino de aroma
      </text>
      <text x="100" y="211" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="800" fontSize="11" fill={tinta(p.band)}>
        D'CHOCOLAT
      </text>
    </>
  )
}

function Caja({ p }) {
  return (
    <>
      <rect x="24" y="60" width="152" height="152" rx="8" fill={C[p.wrap]} stroke={INK} strokeWidth="5" />
      <rect x="44" y="80" width="112" height="112" rx="6" fill="#3b1d10" stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}${c}`} cx={63 + c * 37} cy={99 + r * 37} r="14" fill={(r + c) % 2 ? '#7a3d22' : '#5a2c18'} stroke={INK} strokeWidth="3" />
        )),
      )}
      <rect x="24" y="222" width="152" height="24" rx="4" fill={C[p.band]} stroke={INK} strokeWidth="4" />
      <text x="100" y="239" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="800" fontSize="12" fill={tinta(p.band)}>
        D'CHOCOLAT · 9 bombones
      </text>
    </>
  )
}

function Bolsa({ p }) {
  return (
    <>
      <path d="M50 40 L150 40 L150 58 L160 246 L40 246 L50 58 Z" fill={C[p.wrap]} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 58 L150 58" stroke={INK} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${56 + i * 14} 40 L${62 + i * 14} 30 L${68 + i * 14} 40`} fill={C[p.wrap]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <rect x="52" y="104" width="96" height="96" rx="48" fill={C[p.band]} stroke={INK} strokeWidth="4" />
      <text x="100" y="146" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="900" fontSize="15" fill={tinta(p.band)}>
        {p.id === 'nibs' ? 'NIBS' : 'TAZA'}
      </text>
      <text x="100" y="166" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="600" fontSize="11" fill={tinta(p.band)}>
        {p.peso}
      </text>
      <text x="100" y="228" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="800" fontSize="12" fill={tinta(p.wrap)}>
        D'CHOCOLAT
      </text>
    </>
  )
}

export default function ProductArt({ p, className = '' }) {
  const Forma = p.forma === 'caja' ? Caja : p.forma === 'bolsa' ? Bolsa : Tableta
  return (
    <svg className={`product-art ${className}`} viewBox="0 0 200 260" role="img" aria-label={`Empaque de ${p.nombre}`}>
      <Forma p={p} />
    </svg>
  )
}
