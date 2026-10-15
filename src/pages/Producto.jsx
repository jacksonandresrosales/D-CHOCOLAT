import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import AddToCart from '../components/AddToCart'
import Mascot from '../components/Mascot'
import { ease, spring } from '../components/anim'
import { useCart } from '../context/CartContext'
import { CATEGORIAS, porId, relacionados } from '../data/products'
import { ENVIO, ENVIO_GRATIS, usd } from '../config'

export default function Producto() {
  const { id } = useParams()
  const p = porId(id)
  const { qtyDe } = useCart()

  if (!p) {
    return (
      <div className="page empty">
        <Mascot mood="triste" size={200} />
        <h1>No encontramos ese chocolate</h1>
        <Link className="btn" to="/chocolates">
          Ver todos los chocolates
        </Link>
      </div>
    )
  }

  const cat = CATEGORIAS.find((c) => c.id === p.cat)
  const otros = relacionados(p)

  return (
    <div className="page detail">
      <nav className="crumbs" aria-label="Ruta de navegación">
        <Link to="/chocolates">Chocolates</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/chocolates?cat=${p.cat}`}>{cat.nombre}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{p.nombre}</span>
      </nav>

      <div className="detail__grid">
        <motion.div
          className="detail__media"
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          <ProductImage p={p} eager sizes="(max-width: 900px) 100vw, 50vw" />
        </motion.div>

        <div className="detail__info">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 }}>
            {p.nombre}
          </motion.h1>
          <motion.p className="detail__price" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.18 }}>
            {usd(p.precio)} <span>· {p.peso}</span>
          </motion.p>
          <motion.p className="detail__lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.26 }}>
            {p.desc}
          </motion.p>

          <motion.dl className="detail__facts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.34 }}>
            <div>
              <dt>Notas de cata</dt>
              <dd>{p.notas}</dd>
            </div>
            <div>
              <dt>Origen</dt>
              <dd>{p.origen}</dd>
            </div>
            <div>
              <dt>Cacao</dt>
              <dd className="meter-row">
                <span className="meter" role="img" aria-label={`${p.pct}% de cacao`}>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: p.pct / 100 }}
                    transition={{ ...spring, delay: 0.5 }}
                  />
                </span>
                <strong>{p.pct}%</strong>
              </dd>
            </div>
          </motion.dl>

          <motion.div className="detail__buy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.42 }}>
            <AddToCart p={p} />
            {qtyDe(p.id) > 0 && (
              <Link className="btn btn--accent btn--block" to="/carrito">
                Ir al carrito y pedir
              </Link>
            )}
            <p className="detail__ship">
              Envío a domicilio {usd(ENVIO)}, gratis desde {usd(ENVIO_GRATIS)}. También puedes retirarlo sin costo.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="related" aria-labelledby="rel-h">
        <h2 id="rel-h">También te puede gustar</h2>
        <ul className="shelf shelf--three">
          {otros.map((o) => (
            <ProductCard key={o.id} p={o} heading="h3" reveal={false} sizes="(max-width: 560px) 46vw, 320px" />
          ))}
        </ul>
      </section>
    </div>
  )
}
