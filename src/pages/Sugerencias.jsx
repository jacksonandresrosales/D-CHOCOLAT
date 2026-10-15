import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import ProductArt from '../components/ProductArt'
import useReveal from '../components/useReveal'
import { useCart } from '../context/CartContext'
import { PRODUCTOS } from '../data/products'
import { usd, waLink } from '../config'

const PREGUNTAS = [
  {
    id: 'gusto',
    q: '¿Cómo te gusta el chocolate?',
    ops: [
      ['dulce', 'Dulce y suave'],
      ['equilibrado', 'Ni muy muy, ni tan tan'],
      ['intenso', 'Amargo e intenso'],
    ],
  },
  {
    id: 'extra',
    q: '¿Con algo más?',
    ops: [
      ['solo', 'Solo chocolate'],
      ['fruta', 'Con fruta'],
      ['cafe', 'Con café o especias'],
      ['leche', 'Cremoso, con leche'],
    ],
  },
  {
    id: 'para',
    q: '¿Para qué es?',
    ops: [
      ['mi', 'Un antojo para mí'],
      ['regalo', 'Para regalar'],
      ['cocina', 'Para cocinar o tomar caliente'],
    ],
  },
]

function puntuar(p, r) {
  let s = 0
  if (r.gusto === 'dulce') s += p.pct <= 55 ? 3 : p.sabor.includes('dulce') ? 2 : 0
  if (r.gusto === 'equilibrado') s += p.pct >= 55 && p.pct <= 75 ? 3 : 0
  if (r.gusto === 'intenso') s += p.pct >= 80 ? 3 : p.sabor.includes('intenso') ? 2 : 0
  if (r.extra === 'solo') s += p.cat === 'amargo' ? 2 : 0
  if (r.extra === 'fruta') s += p.sabor.includes('frutal') && p.cat !== 'amargo' ? 3 : p.sabor.includes('frutal') ? 1 : 0
  if (r.extra === 'cafe') s += p.id === 'cafe-loja' || p.id === 'taza-canela' ? 3 : 0
  if (r.extra === 'leche') s += p.cat === 'leche' ? 3 : p.sabor.includes('cremoso') ? 1 : 0
  if (r.para === 'regalo') s += p.forma === 'caja' && p.id === 'bombones-9' ? 3 : 0
  if (r.para === 'cocina') s += ['nibs', 'taza-canela', 'napo-100'].includes(p.id) ? 3 : 0
  if (r.para === 'mi') s += p.forma ? 0 : 1
  return s
}

function Recomendador() {
  const { agregar } = useCart()
  const [r, setR] = useState({})
  const completo = PREGUNTAS.every((p) => r[p.id])
  const top = completo
    ? [...PRODUCTOS].sort((a, b) => puntuar(b, r) - puntuar(a, r) || a.precio - b.precio).slice(0, 3)
    : []

  return (
    <section className="quiz" aria-labelledby="quiz-h">
      <div className="quiz__head">
        <h2 id="quiz-h" data-reveal>
          ¿Cuál me llevo?
        </h2>
        <p data-reveal>Responde tres preguntas y Cacaíto te dice cuál probar primero.</p>
      </div>
      <div className="quiz__body">
        <form className="quiz__form" onSubmit={(e) => e.preventDefault()}>
          {PREGUNTAS.map((p) => (
            <fieldset key={p.id} data-reveal>
              <legend>{p.q}</legend>
              <div className="options">
                {p.ops.map(([v, l]) => (
                  <label key={v} className="option">
                    <input type="radio" name={p.id} value={v} checked={r[p.id] === v} onChange={() => setR({ ...r, [p.id]: v })} />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {Object.keys(r).length > 0 && (
            <button type="button" className="linkbtn" onClick={() => setR({})}>
              Empezar de nuevo
            </button>
          )}
        </form>

        <div className="quiz__result" aria-live="polite">
          {!completo ? (
            <div className="quiz__wait">
              <Mascot mood="feliz" size={170} />
              <p>
                {Object.keys(r).length === 0
                  ? 'Elige una respuesta en cada pregunta.'
                  : `Te faltan ${3 - Object.keys(r).length} ${3 - Object.keys(r).length === 1 ? 'pregunta' : 'preguntas'}.`}
              </p>
            </div>
          ) : (
            <div className="match pop" key={top[0].id}>
              <p className="match__kicker">Tu chocolate es</p>
              <div className="match__main">
                <ProductArt p={top[0]} />
                <div>
                  <h3>{top[0].nombre}</h3>
                  <p>{top[0].desc}</p>
                  <p className="match__notes">{top[0].notas}</p>
                  <button className="btn" onClick={() => agregar(top[0].id)}>
                    Añadir · {usd(top[0].precio)}
                  </button>
                </div>
              </div>
              <p className="match__also">También te pueden gustar:</p>
              <ul className="match__alts">
                {top.slice(1).map((p) => (
                  <li key={p.id}>
                    <span>
                      {p.nombre} · {usd(p.precio)}
                    </span>
                    <button className="linkbtn" onClick={() => agregar(p.id)} aria-label={`Añadir ${p.nombre}`}>
                      Añadir
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const TIPOS = ['Sugerencia', 'Quiero un sabor nuevo', 'Felicitación', 'Algo no salió bien']

function Buzon() {
  const [f, setF] = useState({ nombre: '', tipo: TIPOS[0], mensaje: '' })
  const [err, setErr] = useState({})
  const [enviado, setEnviado] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    const errores = {}
    if (f.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre para saber a quién responder.'
    if (f.mensaje.trim().length < 10) errores.mensaje = 'Cuéntanos un poco más (mínimo 10 letras).'
    setErr(errores)
    if (Object.keys(errores).length) {
      document.getElementById(errores.nombre ? 'b-nombre' : 'b-mensaje')?.focus()
      return
    }
    window.open(waLink(`Buzón D'CHOCOLAT\n${f.tipo} de ${f.nombre.trim()}:\n${f.mensaje.trim()}`), '_blank', 'noopener')
    setEnviado(true)
  }

  return (
    <section className="buzon" aria-labelledby="buzon-h">
      <div className="buzon__card" data-reveal>
        <h2 id="buzon-h">Buzón de sugerencias</h2>
        <p>¿Un sabor que extrañas? ¿Algo que podemos hacer mejor? Lo leemos todo.</p>
        {enviado ? (
          <div className="buzon__ok" role="status">
            <Mascot mood="dulce" size={120} />
            <div>
              <p>
                <strong>¡Gracias, {f.nombre.split(' ')[0]}!</strong> Se abrió WhatsApp con tu mensaje: solo toca enviar.
              </p>
              <button
                className="linkbtn"
                onClick={() => {
                  setEnviado(false)
                  setF({ nombre: f.nombre, tipo: TIPOS[0], mensaje: '' })
                }}
              >
                Escribir otra sugerencia
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <div className="field">
              <label htmlFor="b-nombre">Tu nombre</label>
              <input
                id="b-nombre"
                autoComplete="given-name"
                value={f.nombre}
                onChange={(e) => setF({ ...f, nombre: e.target.value })}
                aria-invalid={!!err.nombre}
                aria-describedby={err.nombre ? 'e-nombre' : undefined}
              />
              {err.nombre && (
                <p className="field__err" id="e-nombre">
                  {err.nombre}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="b-tipo">Es un…</label>
              <select id="b-tipo" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="b-mensaje">Tu mensaje</label>
              <textarea
                id="b-mensaje"
                rows="5"
                value={f.mensaje}
                onChange={(e) => setF({ ...f, mensaje: e.target.value })}
                aria-invalid={!!err.mensaje}
                aria-describedby={err.mensaje ? 'e-mensaje' : 'h-mensaje'}
              />
              {err.mensaje ? (
                <p className="field__err" id="e-mensaje">
                  {err.mensaje}
                </p>
              ) : (
                <p className="field__hint" id="h-mensaje">
                  Se envía por WhatsApp; no guardamos nada en esta página.
                </p>
              )}
            </div>
            <button className="btn" type="submit">
              Enviar sugerencia
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default function Sugerencias() {
  useReveal()
  return (
    <div className="page">
      <header className="page__head">
        <h1 data-reveal>Sugerencias</h1>
        <p data-reveal>
          Te ayudamos a elegir y tú nos ayudas a mejorar. ¿Ya sabes qué quieres? <Link to="/chocolates">Ve directo a la tienda</Link>.
        </p>
      </header>
      <Recomendador />
      <Buzon />
    </div>
  )
}
