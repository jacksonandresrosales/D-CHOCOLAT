import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { porId } from '../data/products'
import credits from '../data/credits.json'
import { WHATSAPP } from '../config'

export function Stripe({ className = '' }) {
  return (
    <div className={`stripe ${className}`} aria-hidden="true">
      {Array.from({ length: 80 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}

function Nav() {
  const { cantidad } = useCart()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    ['/', 'Inicio'],
    ['/chocolates', 'Chocolates'],
    ['/sugerencias', 'Sugerencias'],
  ]
  return (
    <header className="nav">
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
        <Link to="/carrito" className="nav__cart" aria-label={`Carrito, ${cantidad} productos`}>
          Carrito
          <span className={`nav__count ${cantidad ? 'has' : ''}`} key={cantidad}>
            {cantidad}
          </span>
        </Link>
        <button
          className="nav__burger"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>
    </header>
  )
}

function Toast() {
  const { toast } = useCart()
  if (!toast) return null
  const p = porId(toast.id)
  return (
    <div className="toast" role="status" key={toast.key}>
      <span>
        <strong>{p.nombre}</strong> ya está en tu carrito
      </span>
      <Link to="/carrito">Ver carrito</Link>
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
        <div className="blocks" aria-label="D'CHOCOLAT">
          {letras.map((l, i) => (
            <span key={i} className={`block block--${colores[i]}`} style={{ height: `${alturas[i]}%` }} aria-hidden="true">
              {l}
            </span>
          ))}
        </div>
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
          <div className="footer__credits">
            <h2 className="footer__h">Fotografías</h2>
            <p>
              Imágenes del mundo del cacao, no de nuestros productos.{' '}
              {credits.map((c, i) => (
                <span key={c.file || i}>
                  <a href={c.page} target="_blank" rel="noreferrer">
                    {c.title}
                  </a>
                  {c.creator ? `, ${c.creator.split(';')[0]}` : ''} ({c.license}, vía {c.via}){i < credits.length - 1 ? '; ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="footer__last">
          <span>© {new Date().getFullYear()} D'CHOCOLAT · Chocolate artesanal ecuatoriano</span>
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
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div id="top">
      <a href="#main" className="skip">
        Saltar al contenido
      </a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
