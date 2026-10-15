import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import Mascot from '../components/Mascot'
import ProductImage from '../components/ProductImage'
import AddToCart from '../components/AddToCart'
import { Stripe } from '../components/Layout'
import { Counter, Lines, ease, fadeUp, spring, useScrollValue } from '../components/anim'
import { zigzag } from '../components/edges'
import { CATEGORIAS, PRODUCTOS, imgSrc } from '../data/products'
import { usd, waLink } from '../config'

const NAV_H = 72 // alto de la barra de navegación fija
const RAPIDEZ = 1.5 // píxeles que avanza la cinta por cada píxel de scroll

const FOTOS = [
  { base: 'tierra-del-cacao-ecuador', lg: 1600, pos: '50% 40%', alt: 'Una joven sostiene una mazorca de cacao abierta bajo los árboles de una finca ecuatoriana', pie: 'Tierra del cacao, Ecuador' },
  { base: 'theobroma-cacao-cacau-open-fruit', lg: 1600, pos: '50% 50%', alt: 'Mazorca de cacao cortada: cáscara amarilla y granos blancos cubiertos de pulpa', pie: 'La mazorca por dentro' },
  { base: '3b44952u-gathering-cacao-pods-in-ecuador', lg: 1280, pos: '30% 50%', alt: 'Fotografía antigua de trabajadores cosechando mazorcas de cacao con varas largas en Ecuador', pie: 'Cosecha de cacao en Ecuador, hacia 1907' },
  { base: 'cocoa-pod-s-in-ecuador-south-america', lg: 1600, pos: '50% 50%', alt: 'Dos mazorcas de cacao secas sobre una piedra en Quito', pie: 'Mazorcas secas, Quito' },
]
const fuente = (f) => ({ src: `/img/${f.base}-lg.webp`, srcSet: `/img/${f.base}-sm.webp 800w, /img/${f.base}-lg.webp ${f.lg}w` })

/* ---------- portada ---------- */

function Crossfade({ scale, y }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => !document.hidden && setI((n) => (n + 1) % FOTOS.length), 5600)
    return () => clearInterval(t)
  }, [])
  return (
    <figure className="hero__photo">
      <motion.div className="hero__photo-in" style={{ scale, y }}>
        {FOTOS.map((f, n) => (
          <img
            key={f.base}
            {...fuente(f)}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt={n === i ? f.alt : ''}
            aria-hidden={n !== i}
            style={{ objectPosition: f.pos }}
            className={n === i ? 'is-on' : ''}
            loading={n === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </motion.div>
      <figcaption>{FOTOS[i].pie}</figcaption>
    </figure>
  )
}

function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const m = (v) => (reduce ? undefined : v)
  // Al bajar: el toldo corre, Cacaíto salta y gira, la foto se acerca.
  const stripeX = useTransform(scrollYProgress, [0, 1], [0, -168])
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const mascotR = useTransform(scrollYProgress, [0, 1], [0, -16])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.16])
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  return (
    <section className="hero" ref={ref}>
      <div className="hero__card">
        <Stripe drop x={m(stripeX)} />
        <div className="hero__body">
          <motion.p
            className="hero__mark"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            D'CHOCOLAT
          </motion.p>
          <motion.div className="hero__mascot" style={{ y: m(mascotY), rotate: m(mascotR) }}>
            <motion.div
              initial={{ y: -160, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 0.45 }}
            >
              <Mascot size={220} />
            </motion.div>
          </motion.div>
          <Lines as="h1" lines={['Cacao fino,', 'sonrisa grande']} onMount delay={0.6} />
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.85 }}
          >
            Tabletas hechas a mano con cacao Nacional de Ecuador, el que el mundo llama fino de aroma. Desde $3.50.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 1 }}>
            <Link to="/chocolates" className="btn">
              Ver los chocolates
            </Link>
          </motion.div>
          <motion.nav
            className="hero__links"
            aria-label="Atajos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.6 }}
          >
            <Link to="/sugerencias">¿Cuál me llevo?</Link>
            <a href="#proceso">Cómo lo hacemos</a>
            <a href={waLink("Hola D'CHOCOLAT, quiero hacer un pedido.")} target="_blank" rel="noreferrer">
              Pedir por WhatsApp
            </a>
          </motion.nav>
        </div>
      </div>
      <Crossfade scale={m(photoScale)} y={m(photoY)} />
    </section>
  )
}

/* ---------- del árbol, a mano ---------- */

function Intro() {
  const datos = [
    [
      <>
        <Counter to={35} />–<Counter to={100} suffix="%" />
      </>,
      'de cacao, del blanco al puro',
    ],
    [<Counter to={11} />, 'chocolates en la carta'],
    [<Counter to={3.5} decimals={2} prefix="$" />, 'el más barato, los nibs'],
    ['Cero', 'conservantes y colorantes'],
  ]
  return (
    <section className="intro">
      <div className="intro__top">
        <Lines lines={['Del árbol,', 'a mano']} className="intro__h" />
        <motion.p {...fadeUp(0.2)}>
          Compramos el cacao directo a familias de Los Ríos, Esmeraldas y el Napo. Lo fermentamos, lo secamos al sol y lo tostamos en
          lotes pequeños, como se hacía antes.
        </motion.p>
      </div>
      <dl className="facts">
        {datos.map(([d, t], i) => (
          <motion.div key={t} {...fadeUp(i * 0.1)}>
            <dt>{d}</dt>
            <dd>{t}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  )
}

/* ---------- la cinta del taller: los chocolates avanzan mientras bajas ---------- */

function Cinta() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const reduce = useReducedMotion()
  const dist = useMotionValue(0)
  const [alto, setAlto] = useState(0)
  const [bajo, setBajo] = useState(false) // pantallas muy bajas: sin fijar, se desliza con el dedo
  const quieta = reduce || bajo

  useLayoutEffect(() => {
    const medir = () => {
      const t = trackRef.current
      setBajo(window.innerHeight < 560)
      if (!t) return
      const d = Math.max(0, t.scrollWidth - t.clientWidth)
      dist.set(d)
      setAlto(d)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(trackRef.current)
    window.addEventListener('resize', medir)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [dist])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: [`start ${NAV_H}px`, 'end end'] })
  const x = useTransform(() => -scrollYProgress.get() * dist.get())
  const dashes = useTransform(x, (v) => v % 64)
  const spin = useTransform(scrollYProgress, [0, 1], [0, 1440])

  // Con teclado: al enfocar un chocolate, la página baja hasta que la cinta lo muestra.
  const enfocar = (i) => {
    if (quieta) return
    const sec = sectionRef.current
    const t = trackRef.current
    const li = t?.children[i]
    const d = dist.get()
    if (!sec || !li || d <= 0) return
    const objetivo = Math.min(d, Math.max(0, li.offsetLeft - t.clientWidth / 2 + li.offsetWidth / 2))
    const inicio = sec.getBoundingClientRect().top + window.scrollY - NAV_H
    window.scrollTo({ top: inicio + objetivo / RAPIDEZ, behavior: 'instant' })
  }

  return (
    <section
      className={`cinta ${quieta ? 'cinta--quieta' : ''}`}
      ref={sectionRef}
      style={quieta ? undefined : { height: `calc(100vh - ${NAV_H}px + ${Math.round(alto / RAPIDEZ)}px)` }}
      aria-labelledby="cinta-h"
    >
      <div className="cinta__pin">
        <div className="cinta__head">
          <Lines lines={['Recién salidos', 'del taller']} id="cinta-h" />
          <motion.div className="cinta__aside" {...fadeUp(0.15)}>
            <p>Once chocolates hechos a mano. Toca uno para verlo de cerca.</p>
            <Link to="/chocolates" className="btn btn--accent">
              Ver la tienda
            </Link>
          </motion.div>
        </div>
        <motion.ul className="cinta__track" ref={trackRef} style={{ x: quieta ? undefined : x }}>
          {PRODUCTOS.map((p, i) => (
            <li key={p.id} className="cinta__item">
              <Link to={`/chocolates/${p.id}`} onFocus={() => enfocar(i)}>
                <ProductImage p={p} sizes="(max-width: 560px) 62vw, 300px" />
                <span className="cinta__tag">
                  <span>{p.nombre}</span>
                  <span>{usd(p.precio)}</span>
                </span>
              </Link>
            </li>
          ))}
        </motion.ul>
        <div className="cinta__belt" aria-hidden="true">
          <motion.div className="cinta__dashes" style={{ x: quieta ? undefined : dashes }}>
            {Array.from({ length: 48 }, (_, i) => (
              <span key={i} />
            ))}
          </motion.div>
        </div>
        <div className="cinta__rollers" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <motion.span key={i} style={{ rotate: quieta ? undefined : spin }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- ¿qué tan intenso? ---------- */

function Intensidad() {
  const ref = useRef(null)
  const visto = useInView(ref, { once: true, margin: '200px 0px' })
  const [pct, setPct] = useState(70)
  const tabletas = useMemo(() => PRODUCTOS.filter((p) => !p.forma), [])
  const p = useMemo(
    () => tabletas.reduce((a, b) => (Math.abs(b.pct - pct) < Math.abs(a.pct - pct) ? b : a)),
    [pct, tabletas],
  )
  const mood = pct < 50 ? 'dulce' : pct < 80 ? 'feliz' : 'intenso'
  const dicho = pct < 50 ? 'Dulce, cremoso y sin miedo.' : pct < 80 ? 'El punto justo de la casa.' : '¡Solo para valientes!'

  // Precarga las fotos para que el cambio al mover el selector sea instantáneo.
  useEffect(() => {
    if (!visto) return
    tabletas.forEach((t) => {
      const img = new Image()
      img.src = imgSrc(t, 960)
    })
  }, [visto, tabletas])

  return (
    <section className="showcase" aria-labelledby="int-h" ref={ref}>
      <motion.div
        className="showcase__plate"
        initial={{ opacity: 0, x: -90, rotate: -5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
      >
        <motion.div
          key={p.id}
          className="showcase__photo"
          initial={{ scale: 0.82, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: -3, opacity: 1 }}
          transition={spring}
        >
          <ProductImage p={p} sizes="(max-width: 900px) 70vw, 34vw" />
        </motion.div>
        <motion.div
          className="showcase__buddy"
          initial={{ y: 90, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.35 }}
        >
          <Mascot mood={mood} size={150} />
          <p className="bubble" aria-live="polite">
            {dicho}
          </p>
        </motion.div>
      </motion.div>
      <div className="showcase__text">
        <Lines lines={['¿Qué tan intenso?']} id="int-h" />
        <motion.div className="slider" {...fadeUp(0.1)}>
          <label htmlFor="pct">
            Mueve para elegir tu porcentaje de cacao: <strong>{pct}%</strong>
          </label>
          <div className="slider__row">
            <span aria-hidden="true">Dulce</span>
            <input
              id="pct"
              type="range"
              min="35"
              max="100"
              step="5"
              value={pct}
              onChange={(e) => setPct(+e.target.value)}
              aria-valuetext={`${pct}% de cacao`}
            />
            <span aria-hidden="true">Puro</span>
          </div>
        </motion.div>
        <motion.div className="showcase__product" {...fadeUp(0.2)}>
          <h3>{p.nombre}</h3>
          <p className="showcase__notes">
            {p.notas} · {p.origen} · {p.peso}
          </p>
          <p>{p.desc}</p>
        </motion.div>
        <motion.div className="cells" {...fadeUp(0.3)}>
          <AddToCart p={p} variant="cell" />
          <Link className="cell cell--soft" to={`/chocolates/${p.id}`}>
            Ver ficha completa
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- el proceso: un recibo que se imprime mientras bajas ---------- */

const PASOS = [
  {
    t: 'Semana uno, en la finca',
    filas: [
      ['Cosecha a machete', 'día 1'],
      ['Fermentación en cajones de madera', '6 días'],
    ],
  },
  {
    t: 'Semana dos, al sol',
    filas: [
      ['Secado sobre tendales de caña', '7 días'],
      ['Selección grano a grano', '1 día'],
    ],
  },
  {
    t: 'Semana tres, en el taller',
    filas: [
      ['Tostado en lotes pequeños', '25 min'],
      ['Molienda y conchado', '48 h'],
      ['Templado, moldeado y envuelto a mano', '1 día'],
    ],
  },
]

function Proceso() {
  const slipRef = useRef(null)
  const photoRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: slipRef, offset: ['start 0.95', 'start 0.3'] })
  const impreso = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })
  const clipPath = useTransform(impreso, (v) => `inset(0 0 ${Math.max(0, 100 - v * 100).toFixed(2)}% 0)`)
  const photoY = useScrollValue(photoRef, [0, 1], ['-8%', '8%'])

  return (
    <section className="process" id="proceso" aria-labelledby="proc-h">
      <div className="process__text">
        <Lines lines={['Tres semanas', 'por tableta']} id="proc-h" />
        <motion.p {...fadeUp(0.15)}>
          El buen chocolate no se apura. Cada grano pasa por la finca, el sol y el taller antes de llegar a tu mano.
        </motion.p>
        <figure className="process__photo" ref={photoRef}>
          <div className="process__frame">
            <motion.img
              src="/img/cocoa-beans-in-guadeloupe-lg.webp"
              srcSet="/img/cocoa-beans-in-guadeloupe-sm.webp 800w, /img/cocoa-beans-in-guadeloupe-lg.webp 1600w"
              sizes="(max-width: 900px) 100vw, 40vw"
              width="1600"
              height="1067"
              alt="Granos de cacao fermentados secándose sobre una malla"
              loading="lazy"
              style={{ y: photoY }}
            />
          </div>
          <figcaption>Granos de cacao secándose al sol</figcaption>
        </figure>
      </div>
      <div className="slip-wrap">
        <div className="slip-slot" aria-hidden="true" />
        <motion.div className="slip-reveal" ref={slipRef} style={{ clipPath: reduce ? undefined : clipPath }}>
          <div className="slip" style={zigzag({ teeth: 30, depth: 12 })}>
            {PASOS.map((g) => (
              <div key={g.t} className="slip__group">
                <h3>{g.t}</h3>
                {g.filas.map(([a, b]) => (
                  <p key={a} className="slip__row">
                    <span>{a}</span>
                    <i aria-hidden="true" />
                    <span>{b}</span>
                  </p>
                ))}
              </div>
            ))}
            <p className="slip__total">
              <span>Tu tableta, lista</span>
              <span>21 días</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- la carta ---------- */

function Carta() {
  const ref = useRef(null)
  const y = useScrollValue(ref, [0, 1], [170, 0], ['start end', 'start 0.2'])
  const rotate = useScrollValue(ref, [0, 1], [5, 0], ['start end', 'start 0.2'])
  return (
    <section className="menu" aria-labelledby="carta-h" ref={ref}>
      <motion.div className="sheet" style={{ ...zigzag({ teeth: 40, depth: 12, top: true }), y, rotate }}>
        <h2 id="carta-h">La carta</h2>
        <p className="sheet__note">Precios en dólares, impuestos incluidos. Toca + para añadir.</p>
        {CATEGORIAS.filter((c) => c.id !== 'todos').map((c) => (
          <div key={c.id} className="sheet__group">
            <h3>{c.nombre}</h3>
            <ul>
              {PRODUCTOS.filter((p) => p.cat === c.id).map((p, i) => (
                <motion.li key={p.id} {...fadeUp(i * 0.06)}>
                  <div className="sheet__item">
                    <Link className="sheet__name" to={`/chocolates/${p.id}`}>
                      {p.nombre}
                    </Link>
                    <span className="sheet__price">{usd(p.precio)}</span>
                    <AddToCart p={p} variant="compact" />
                  </div>
                  <span className="sheet__desc">{p.notas}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
        <p className="sheet__hours">
          Pedidos de lunes a sábado, de 9:00 a 19:00.
          <br />
          Entregamos en 24 a 48 horas.
        </p>
      </motion.div>
    </section>
  )
}

/* ---------- cierre ---------- */

function Cierre() {
  const ref = useRef(null)
  const peekY = useScrollValue(ref, [0.35, 1], ['105%', '14%'], ['start end', 'start 0.15'])
  const lineas = ['Abre una.', 'Sonríe.']
  return (
    <section className="close" ref={ref} aria-labelledby="close-h">
      <h2 className="close__h" id="close-h">
        <span className="sr-only">Abre una. Sonríe.</span>
        {lineas.map((l, li) => (
          <span className="close__line" key={l} aria-hidden="true">
            {[...l].map((ch, ci) => (
              <motion.span
                key={ci}
                className="ch"
                initial={{ y: '70%', opacity: 0, rotate: ci % 2 ? 10 : -10 }}
                whileInView={{ y: '0%', opacity: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', stiffness: 380, damping: 13, delay: li * 0.3 + ci * 0.04 }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </span>
        ))}
      </h2>
      <div className="close__foot">
        <motion.p {...fadeUp(0.1)}>Arma tu pedido y nos llega por WhatsApp. Te confirmamos el total y la hora de entrega.</motion.p>
        <motion.div {...fadeUp(0.25)}>
          <Link to="/chocolates" className="btn btn--accent">
            Armar mi pedido
          </Link>
        </motion.div>
      </div>
      <motion.div className="close__peek" style={{ y: peekY }} aria-hidden="true">
        <Mascot size={260} />
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Cinta />
      <Intensidad />
      <Proceso />
      <Carta />
      <Cierre />
    </>
  )
}
