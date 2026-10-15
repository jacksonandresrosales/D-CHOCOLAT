import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'motion/react'
import { useCart } from '../context/CartContext'
import { imgSrc, porId } from '../data/products'
import { WHATSAPP, usd } from '../config'
import { ease } from './anim'

// Franja de toldo de la envoltura. x: valor de movimiento opcional para desplazarla con el scroll.
export function Stripe({ className = '', x, drop = false }) {
  return (
    <div className={`stripe ${drop ? 'stripe--drop' : ''} ${className}`} aria-hidden="true">
      <motion.div className="stripe__row" style={{ x }}>
        {Array.from({ length: 90 }, (_, i) => (
          <span key={i} style={drop ? { '--i': i } : undefined} />
        ))}
      </motion.div>
    </div>
  )
}

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 })
  return <motion.div className="nav__progress" style={{ scaleX }} aria-hidden="true" />
}

function Nav() {
  const { cantidad } = useCart()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navRef = useRef(null)
  const burgerRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // El menú del teléfono se cierra con Escape o tocando fuera de él.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const links = [
    ['/', 'Inicio'],
    ['/chocolates', 'Chocolates'],
    ['/sugerencias', 'Sugerencias'],
  ]
  return (
    <header className="nav" ref={navRef}>
      <div className="nav__inner">
        <Link to="/" className="nav__mark" aria-label="D'CHOCOLAT, inicio">
          D'CHOCOLAT
        </Link>
        <nav aria-label="Principal" className={`nav__links ${open ? 'is-open' : ''}`} id="menu">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/carrito" className="nav__cart" data-cart-target aria-label={`Carrito, ${cantidad} productos`}>
          Carrito
          <span className={`nav__count ${cantidad ? 'has' : ''}`} key={cantidad}>
            {cantidad}
          </span>
        </Link>
        <button
          ref={burgerRef}
          className="nav__burger"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>
      <ScrollBar />
    </header>
  )
}

function Toast({ arriba }) {
  const { toast } = useCart()
  if (!toast) return null
  const p = porId(toast.id)
  return (
    <div className={`toast ${arriba ? 'toast--up' : ''}`} role="status" key={toast.key}>
      <img src={imgSrc(p, 480)} alt="" width="48" height="48" />
      <span>
        <strong>{p.nombre}</strong> ya está en tu carrito
      </span>
      <Link to="/carrito">Ver carrito</Link>
    </div>
  )
}

// Resumen fijo abajo en el teléfono, para llegar al carrito con el pulgar.
function CartBar() {
  const { cantidad, subtotal } = useCart()
  return (
    <div className="cartbar" role="region" aria-label="Resumen de tu pedido">
      <span>
        <strong>
          {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
        </strong>{' '}
        · {usd(subtotal)}
      </span>
      <Link to="/carrito" className="btn btn--accent btn--small">
        Ver carrito
      </Link>
    </div>
  )
}

function Footer() {
  const letras = "D'CHOCOLAT".split('')
  const alturas = [100, 78, 64, 92, 70, 84, 66, 96, 74, 88]
  const colores = ['red', 'yellow', 'paper', 'red', 'yellow', 'paper', 'red', 'yellow', 'paper', 'red']
  return (
    <footer className="footer">
      <Stripe className="stripe--thin" />
      <div className="footer__inner">
        <motion.div
          className="blocks"
          aria-label="D'CHOCOLAT"
          role="img"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        >
          {letras.map((l, i) => (
            <motion.span
              key={i}
              className={`block block--${colores[i]}`}
              style={{ height: `${alturas[i]}%` }}
              aria-hidden="true"
              custom={i}
              variants={{
                hidden: { scaleY: 0 },
                show: (n) => ({ scaleY: 1, transition: { type: 'spring', stiffness: 260, damping: 16, delay: n * 0.05 } }),
              }}
              whileHover={{ scaleY: 1.06 }}
            >
              {l}
            </motion.span>
          ))}
        </motion.div>
        <div className="footer__cols">
          <div>
            <h2 className="footer__h">Tienda</h2>
            <Link to="/chocolates">Todos los chocolates</Link>
            <Link to="/sugerencias">¿Cuál me llevo?</Link>
            <Link to="/carrito">Tu carrito</Link>
          </div>
          <div>
            <h2 className="footer__h">Taller</h2>
            <p>Hecho a mano en Ecuador con cacao Nacional fino de aroma.</p>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
              Escríbenos por WhatsApp
            </a>
          </div>
          <div>
            <h2 className="footer__h">Horario</h2>
            <p>Pedidos de lunes a sábado, de 9:00 a 19:00.</p>
            <p>Entregamos en 24 a 48 horas.</p>
          </div>
        </div>
        <div className="footer__last">
          <span>
            © {new Date().getFullYear()} D'CHOCOLAT · Chocolate artesanal ecuatoriano · <Link to="/creditos">Créditos</Link>
          </span>
          <a href="#top" className="btn btn--small">
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const { cantidad } = useCart()
  const conBarra = cantidad > 0 && pathname !== '/carrito'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div id="top" className={conBarra ? 'has-cartbar' : ''}>
      <a href="#main" className="skip">
        Saltar al contenido
      </a>
      <Nav />
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      {conBarra && <CartBar />}
      <Toast arriba={conBarra} />
    </div>
  )
}
