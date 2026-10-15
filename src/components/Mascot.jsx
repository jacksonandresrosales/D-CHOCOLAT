// "Cacaíto": la mascota de D'CHOCOLAT. Tableta de chocolate con estilo
// de dibujo animado de los años 30: ojos de pastel, brazos de manguera,
// guantes blancos y zapatones. Dibujo original, todo en SVG.
// mood: 'feliz' | 'dulce' | 'intenso' | 'triste'

const INK = '#1c0d06'

function Ojo({ cx, mood }) {
  if (mood === 'dulce') {
    return (
      <path d={`M${cx - 13} 90 Q${cx} 74 ${cx + 13} 90`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    )
  }
  const dy = mood === 'triste' ? 6 : 0
  return (
    <g>
      <ellipse cx={cx} cy="86" rx="14" ry="20" fill="#fffaf0" stroke={INK} strokeWidth="4.5" />
      <ellipse cx={cx + 2} cy={90 + dy} rx="7.5" ry="11.5" fill={INK} />
      {/* el corte de pastel en la pupila */}
      <path d={`M${cx + 2} ${90 + dy} L${cx + 5} ${78 + dy} L${cx + 10} ${83 + dy} Z`} fill="#fffaf0" />
    </g>
  )
}

function Boca({ mood }) {
  if (mood === 'triste') {
    return <path d="M102 130 Q120 114 138 130" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
  }
  if (mood === 'intenso') {
    return (
      <g>
        <path d="M96 112 Q120 146 144 112 Z" fill={INK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M100 114 L140 114 L137 121 L103 121 Z" fill="#fffaf0" />
      </g>
    )
  }
  return (
    <g>
      <path d="M96 110 Q120 150 144 110 Q120 120 96 110 Z" fill={INK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M108 128 Q120 140 132 128 Q120 121 108 128 Z" fill="#e2453a" />
    </g>
  )
}

function Guante({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="14" fill="#fffaf0" stroke={INK} strokeWidth="4.5" />
      <path d={`M${x - 6} ${y - 4} L${x - 6} ${y + 6} M${x} ${y - 6} L${x} ${y + 6}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

export default function Mascot({ mood = 'feliz', size = 240, title = 'Cacaíto, la mascota de D\'CHOCOLAT', className = '' }) {
  return (
    <svg
      className={`mascot mascot--${mood} ${className}`}
      viewBox="0 0 240 300"
      width={size}
      height={size * 1.25}
      role="img"
      aria-label={title}
    >
      <g className="m-bob">
        {/* piernas de manguera y zapatones */}
        <g className="m-legs">
          <path d="M100 186 C 98 214 92 232 92 252" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <path d="M140 186 C 142 214 148 232 150 252" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="82" cy="262" rx="27" ry="15" fill="#d62b1f" stroke={INK} strokeWidth="4.5" />
          <ellipse cx="158" cy="262" rx="27" ry="15" fill="#d62b1f" stroke={INK} strokeWidth="4.5" />
          <ellipse cx="74" cy="256" rx="8" ry="4" fill="#fffaf0" opacity=".85" />
          <ellipse cx="150" cy="256" rx="8" ry="4" fill="#fffaf0" opacity=".85" />
        </g>

        {/* brazo izquierdo, en la cintura */}
        <path d="M72 128 C 44 128 36 150 50 164" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <Guante x={56} y={166} />

        {/* cuerpo: tableta con un mordisco en la esquina */}
        <path
          d="M86 40 L136 40 Q142 52 152 50 Q158 60 168 60 Q166 68 170 76 L170 176 Q170 190 156 190 L84 190 Q70 190 70 176 L70 56 Q70 40 86 40 Z"
          fill="#6b3420"
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M81 60 L81 116" stroke="#9a5a36" strokeWidth="6" strokeLinecap="round" />

        {/* cara */}
        <g className="m-face">
          {mood === 'intenso' && (
            <g stroke={INK} strokeWidth="5" strokeLinecap="round">
              <path d="M88 62 L114 70" />
              <path d="M152 62 L126 70" />
            </g>
          )}
          <g className="m-eyes">
            <Ojo cx={102} mood={mood} />
            <Ojo cx={138} mood={mood} />
          </g>
          <circle cx="86" cy="114" r="7" fill="#e2553f" opacity=".6" />
          <circle cx="154" cy="114" r="7" fill="#e2553f" opacity=".6" />
          <Boca mood={mood} />
          {mood === 'triste' && <path d="M152 100 Q148 110 152 114 Q156 110 152 100 Z" fill="#8fd3ff" stroke={INK} strokeWidth="2" />}
        </g>

        {/* envoltura roja con borde de papel dorado */}
        <path d="M64 146 L72 138 L80 146 L88 138 L96 146 L104 138 L112 146 L120 138 L128 146 L136 138 L144 146 L152 138 L160 146 L168 138 L176 146 L176 152 L64 152 Z" fill="#ffc21a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <rect x="64" y="150" width="112" height="46" rx="6" fill="#d62b1f" stroke={INK} strokeWidth="5" />
        <rect x="64" y="164" width="112" height="14" fill="#f7ecd9" />
        <text x="120" y="176" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="800" fontSize="13" fill={INK}>
          D'CHOCOLAT
        </text>

        {/* brazo derecho saludando */}
        <g className="m-wave">
          <path d="M168 120 C 192 112 202 92 200 72" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <Guante x={200} y={62} />
        </g>
      </g>
    </svg>
  )
}
