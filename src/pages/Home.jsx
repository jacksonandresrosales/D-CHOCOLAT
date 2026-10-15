import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import ProductArt from '../components/ProductArt'
import { Stripe } from '../components/Layout'
import useReveal from '../components/useReveal'
import { zigzag } from '../components/edges'
import { useCart } from '../context/CartContext'
import { CATEGORIAS, PRODUCTOS } from '../data/products'
import { usd, waLink } from '../config'

const FOTOS = [
  { src: '/img/tierra-del-cacao-ecuador.jpg', w: 1920, h: 2560, pos: '50% 40%', alt: 'Una joven sostiene una mazorca de cacao abierta bajo los árboles de una finca ecuatoriana', pie: 'Tierra del cacao, Ecuador' },
  { src: '/img/theobroma-cacao-cacau-open-fruit.jpg', w: 1920, h: 1920, pos: '50% 50%', alt: 'Mazorca de cacao cortada: cáscara amarilla y granos blancos cubiertos de pulpa', pie: 'La mazorca por dentro' },
  { src: '/img/3b44952u-gathering-cacao-pods-in-ecuador.jpg', w: 1280, h: 618, pos: '30% 50%', alt: 'Fotografía antigua de trabajadores cosechando mazorcas de cacao con varas largas en Ecuador', pie: 'Cosecha de cacao en Ecuador, hacia 1907' },
  { src: '/img/cocoa-pod-s-in-ecuador-south-america.jpg', w: 1920, h: 1440, pos: '50% 50%', alt: 'Dos mazorcas de cacao secas sobre una piedra en Quito', pie: 'Mazorcas secas, Quito' },
]

function Crossfade() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t = setInterval(() => !document.hidden && setI((n) => (n + 1) % FOTOS.length), 5600)
    return () => clearInterval(t)
  }, [])
  return (
    <figure className="hero__photo">
      {FOTOS.map((f, n) => (
        <img
          key={f.src}
          src={f.src}
          width={f.w}
          height={f.h}
          alt={n === i ? f.alt : ''}
          aria-hidden={n !== i}
          style={{ objectPosition: f.pos }}
          className={n === i ? 'is-on' : ''}
          loading={n === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <figcaption>{FOTOS[i].pie}</figcaption>
    </figure>
  )
}

function Intensidad() {
  const { agregar } = useCart()
  const [pct, setPct] = useState(70)
  const tabletas = PRODUCTOS.filter((p) => !p.forma)
  const p = useMemo(
    () => tabletas.reduce((a, b) => (Math.abs(b.pct - pct) < Math.abs(a.pct - pct) ? b : a)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pct],
  )
  const mood = pct < 50 ? 'dulce' : pct < 80 ? 'feliz' : 'intenso'
  const dicho = pct < 50 ? 'Dulce, cremoso y sin miedo.' : pct < 80 ? 'El punto justo de la casa.' : '¡Solo para valientes!'

  return (
    <section className="showcase" aria-labelledby="int-h">
      <div className="showcase__plate" data-reveal>
        <ProductArt p={p} key={p.id} className="pop" />
        <div className="showcase__buddy">
          <Mascot mood={mood} size={150} />
          <p className="bubble" aria-live="polite">{dicho}</p>
        </div>
      </div>
      <div className="showcase__text">
        <h2 id="int-h" data-reveal>
          ¿Qué tan intenso?
        </h2>
        <div className="slider" data-reveal>
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
        </div>
        <div className="showcase__product" data-reveal>
          <h3>{p.nombre}</h3>
          <p className="showcase__notes">
            {p.notas} · {p.origen} · {p.peso}
          </p>
          <p>{p.desc}</p>
        </div>
        <div className="cells">
          <button className="cell cell--ink" onClick={() => agregar(p.id)}>
            Añadir al carrito · {usd(p.precio)}
          </button>
          <Link className="cell cell--soft" to="/chocolates">
            Ver los once
          </Link>
        </div>
      </div>
    </section>
  )
}

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

export default function Home() {
  const { agregar } = useCart()
  useReveal()

  return (
    <>
      <section className="hero">
        <div className="hero__card">
          <Stripe />
          <div className="hero__body">
            <p className="hero__mark" data-reveal>
              D'CHOCOLAT
            </p>
            <Mascot className="hero__mascot" size={220} />
            <h1 data-reveal>
              Cacao fino,
              <br />
              sonrisa grande
            </h1>
            <p className="hero__lead" data-reveal>
              Tabletas hechas a mano con cacao Nacional de Ecuador, el que el mundo llama fino de aroma. Desde $3.50.
            </p>
            <Link to="/chocolates" className="btn" data-reveal>
              Ver los chocolates
            </Link>
            <nav className="hero__links" aria-label="Atajos">
              <Link to="/sugerencias">¿Cuál me llevo?</Link>
              <a href="#proceso">Cómo lo hacemos</a>
              <a href={waLink('Hola D\'CHOCOLAT, quiero hacer un pedido.')} target="_blank" rel="noreferrer">
                Pedir por WhatsApp
              </a>
            </nav>
          </div>
        </div>
        <Crossfade />
      </section>

      <section className="intro">
        <div className="intro__top">
          <h2 data-reveal>Del árbol, a mano</h2>
          <p data-reveal>
            Compramos el cacao directo a familias de Los Ríos, Esmeraldas y el Napo. Lo fermentamos, lo secamos al sol y lo tostamos en
            lotes pequeños, como se hacía antes.
          </p>
        </div>
        <dl className="facts">
          {[
            ['35–100%', 'de cacao, del blanco al puro'],
            ['Once', 'chocolates en la carta'],
            ['$3.50', 'el más barato, los nibs'],
            ['Cero', 'conservantes y colorantes'],
          ].map(([d, t]) => (
            <div key={d} data-reveal>
              <dt>{d}</dt>
              <dd>{t}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Intensidad />

      <section className="process" id="proceso" aria-labelledby="proc-h">
        <div className="process__text">
          <h2 id="proc-h" data-reveal>
            Tres semanas por tableta
          </h2>
          <p data-reveal>
            El buen chocolate no se apura. Cada grano pasa por la finca, el sol y el taller antes de llegar a tu mano.
          </p>
          <figure className="process__photo" data-reveal>
            <img
              src="/img/cocoa-beans-in-guadeloupe.jpg"
              width="1920"
              height="1280"
              alt="Granos de cacao fermentados secándose sobre una malla"
              loading="lazy"
            />
            <figcaption>Granos de cacao secándose al sol</figcaption>
          </figure>
        </div>
        <div className="slip" data-reveal style={zigzag({ teeth: 30, depth: 12 })}>
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
      </section>

      <section className="menu" aria-labelledby="carta-h">
        <div className="sheet" data-reveal style={zigzag({ teeth: 40, depth: 12, top: true })}>
          <h2 id="carta-h">La carta</h2>
          <p className="sheet__note">Precios en dólares, impuestos incluidos.</p>
          {CATEGORIAS.filter((c) => c.id !== 'todos').map((c) => (
            <div key={c.id} className="sheet__group">
              <h3>{c.nombre}</h3>
              <ul>
                {PRODUCTOS.filter((p) => p.cat === c.id).map((p) => (
                  <li key={p.id}>
                    <div className="sheet__item">
                      <span className="sheet__name">{p.nombre}</span>
                      <span className="sheet__price">{usd(p.precio)}</span>
                      <button className="sheet__add" onClick={() => agregar(p.id)} aria-label={`Añadir ${p.nombre} al carrito`}>
                        +
                      </button>
                    </div>
                    <span className="sheet__desc">{p.notas}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="sheet__hours">
            Pedidos de lunes a sábado, de 9:00 a 19:00.
            <br />
            Entregamos en 24 a 48 horas.
          </p>
        </div>
      </section>

      <section className="close">
        <h2 data-reveal>
          Abre una.
          <br />
          Sonríe.
        </h2>
        <div className="close__foot">
          <p data-reveal>Arma tu pedido y nos llega por WhatsApp. Te confirmamos el total y la hora de entrega.</p>
          <Link to="/chocolates" className="btn btn--accent" data-reveal>
            Armar mi pedido
          </Link>
        </div>
      </section>
    </>
  )
}
