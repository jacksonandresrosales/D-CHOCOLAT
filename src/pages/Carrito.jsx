import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Mascot from '../components/Mascot'
import ProductImage from '../components/ProductImage'
import AddToCart from '../components/AddToCart'
import { ease } from '../components/anim'
import { useCart } from '../context/CartContext'
import { PRODUCTOS } from '../data/products'
import { ENVIO, ENVIO_GRATIS, usd, waLink } from '../config'

export default function Carrito() {
  const { lineas, subtotal, fijar, vaciar, cantidad } = useCart()
  const [entrega, setEntrega] = useState('domicilio')
  const [f, setF] = useState({ nombre: '', ciudad: '', direccion: '', notas: '' })
  const [err, setErr] = useState({})
  const [confirmar, setConfirmar] = useState(false)

  const falta = Math.max(0, ENVIO_GRATIS - subtotal)
  const envio = entrega === 'domicilio' && falta > 0 ? ENVIO : 0
  const total = subtotal + envio

  if (!lineas.length) {
    return (
      <div className="page empty">
        <Mascot mood="triste" size={200} />
        <h1>Tu carrito está vacío</h1>
        <p>Cacaíto se siente solo. Llévate uno de los once.</p>
        <Link className="btn" to="/chocolates">
          Ver los chocolates
        </Link>
      </div>
    )
  }

  // Sugerencias para completar el pedido: los más baratos que aún no están en el carrito.
  const enCarrito = new Set(lineas.map((l) => l.producto.id))
  const extras = PRODUCTOS.filter((p) => !enCarrito.has(p.id))
    .sort((a, b) => a.precio - b.precio)
    .slice(0, 3)

  const pedir = (e) => {
    e.preventDefault()
    const er = {}
    if (f.nombre.trim().length < 2) er.nombre = 'Escribe tu nombre.'
    if (entrega === 'domicilio' && f.ciudad.trim().length < 2) er.ciudad = 'Escribe tu ciudad.'
    if (entrega === 'domicilio' && f.direccion.trim().length < 5) er.direccion = 'Escribe la dirección de entrega.'
    setErr(er)
    const primero = Object.keys(er)[0]
    if (primero) return document.getElementById(`c-${primero}`)?.focus()

    const texto = [
      `Hola D'CHOCOLAT, soy ${f.nombre.trim()} y quiero pedir:`,
      ...lineas.map((l) => `• ${l.qty} × ${l.producto.nombre} (${usd(l.qty * l.producto.precio)})`),
      `Subtotal: ${usd(subtotal)}`,
      entrega === 'domicilio' ? `Envío: ${envio ? usd(envio) : 'gratis'}` : 'Retiro en el taller',
      `Total: ${usd(total)}`,
      entrega === 'domicilio' ? `Entregar en: ${f.direccion.trim()}, ${f.ciudad.trim()}` : '',
      f.notas.trim() ? `Notas: ${f.notas.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(waLink(texto), '_blank', 'noopener')
  }

  const campo = (id, label, props = {}) => (
    <div className="field">
      <label htmlFor={`c-${id}`}>{label}</label>
      <input
        id={`c-${id}`}
        value={f[id]}
        onChange={(e) => setF({ ...f, [id]: e.target.value })}
        aria-invalid={!!err[id]}
        aria-describedby={err[id] ? `ce-${id}` : undefined}
        {...props}
      />
      {err[id] && (
        <p className="field__err" id={`ce-${id}`}>
          {err[id]}
        </p>
      )}
    </div>
  )

  return (
    <div className="page">
      <header className="page__head">
        <h1>Tu carrito</h1>
        <p>
          {cantidad} {cantidad === 1 ? 'producto' : 'productos'}. Revisa, completa tus datos y envía el pedido por WhatsApp.
        </p>
      </header>

      <div className="cart">
        <section aria-label="Productos en el carrito">
          <div className="freeship" aria-live="polite">
            <p>
              {falta > 0 ? (
                <>
                  Te faltan <strong>{usd(falta)}</strong> para el envío gratis.
                </>
              ) : (
                <strong>¡Tu envío a domicilio es gratis!</strong>
              )}
            </p>
            <div className="freeship__bar" aria-hidden="true">
              <motion.span animate={{ scaleX: Math.min(1, subtotal / ENVIO_GRATIS) }} transition={{ duration: 0.6, ease }} />
            </div>
          </div>

          <ul className="cart__list">
            <AnimatePresence initial={false}>
              {lineas.map(({ producto: p, qty }) => (
                <motion.li
                  key={p.id}
                  className="line"
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.35, ease }}
                >
                  <Link to={`/chocolates/${p.id}`} className="line__art" tabIndex={-1} aria-hidden="true">
                    <ProductImage p={p} sizes="80px" />
                  </Link>
                  <div className="line__info">
                    <h2>
                      <Link to={`/chocolates/${p.id}`}>{p.nombre}</Link>
                    </h2>
                    <p>
                      {usd(p.precio)} c/u · {p.peso}
                    </p>
                    <button className="linkbtn" onClick={() => fijar(p.id, 0)}>
                      Quitar
                    </button>
                  </div>
                  <div className="stepper" role="group" aria-label={`Cantidad de ${p.nombre}`}>
                    <button onClick={() => fijar(p.id, qty - 1)} aria-label={qty === 1 ? `Quitar ${p.nombre}` : 'Quitar uno'}>
                      −
                    </button>
                    <span aria-live="polite">{qty}</span>
                    <button onClick={() => fijar(p.id, qty + 1)} aria-label="Añadir uno">
                      +
                    </button>
                  </div>
                  <span className="line__sum">{usd(qty * p.precio)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="cart__more">
            <Link to="/chocolates">Seguir comprando</Link>
            {confirmar ? (
              <span className="confirm" role="group" aria-label="Confirmar vaciar carrito">
                ¿Vaciar todo?
                <button className="linkbtn" onClick={() => vaciar()}>
                  Sí, vaciar
                </button>
                <button className="linkbtn" onClick={() => setConfirmar(false)} autoFocus>
                  No
                </button>
              </span>
            ) : (
              <button className="linkbtn" onClick={() => setConfirmar(true)}>
                Vaciar carrito
              </button>
            )}
          </div>

          {extras.length > 0 && (
            <div className="extras">
              <h2>¿Le sumas algo?</h2>
              <ul>
                {extras.map((p) => (
                  <li key={p.id}>
                    <ProductImage p={p} sizes="64px" className="extras__img" />
                    <Link to={`/chocolates/${p.id}`}>
                      <strong>{p.nombre}</strong>
                      <span>
                        {usd(p.precio)} · {p.peso}
                      </span>
                    </Link>
                    <AddToCart p={p} variant="compact" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <form className="receipt" onSubmit={pedir} noValidate>
          <h2>Tu pedido</h2>
          <fieldset className="field">
            <legend>Entrega</legend>
            <div className="options options--row">
              <label className="option">
                <input type="radio" name="entrega" checked={entrega === 'domicilio'} onChange={() => setEntrega('domicilio')} />
                <span>A domicilio · {falta > 0 ? usd(ENVIO) : 'gratis'}</span>
              </label>
              <label className="option">
                <input type="radio" name="entrega" checked={entrega === 'retiro'} onChange={() => setEntrega('retiro')} />
                <span>Retiro gratis</span>
              </label>
            </div>
          </fieldset>
          {campo('nombre', 'Nombre', { autoComplete: 'name' })}
          {entrega === 'domicilio' && (
            <>
              {campo('ciudad', 'Ciudad', { autoComplete: 'address-level2' })}
              {campo('direccion', 'Dirección y referencia', { autoComplete: 'street-address' })}
            </>
          )}
          {campo('notas', 'Notas (opcional)', { placeholder: 'Ej.: es para regalo, sin tarjeta' })}

          <dl className="receipt__sum">
            <div>
              <dt>Subtotal</dt>
              <dd>{usd(subtotal)}</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>{envio ? usd(envio) : 'Gratis'}</dd>
            </div>
            <div className="receipt__total">
              <dt>Total</dt>
              <dd>{usd(total)}</dd>
            </div>
          </dl>
          <button className="btn btn--accent btn--block" type="submit">
            Enviar pedido por WhatsApp
          </button>
          <p className="field__hint">Pagas al recibir o por transferencia; te confirmamos por WhatsApp.</p>
        </form>
      </div>
    </div>
  )
}
