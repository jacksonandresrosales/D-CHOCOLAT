import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import AddToCart from './AddToCart'
import { usd } from '../config'

// Tarjeta de producto: foto y nombre llevan a la ficha; el botón añade sin salir de la página.
export default function ProductCard({ p, heading: H = 'h2', sizes, reveal = true }) {
  const url = `/chocolates/${p.id}`
  return (
    <li className="item" data-reveal={reveal ? '' : undefined}>
      <Link to={url} className="item__media" tabIndex={-1} aria-hidden="true">
        <ProductImage p={p} sizes={sizes} />
      </Link>
      <div className="item__body">
        <div className="item__title">
          <H>
            <Link to={url}>{p.nombre}</Link>
          </H>
          <span className="item__price">{usd(p.precio)}</span>
        </div>
        <p className="item__meta">
          {p.notas} · {p.peso}
        </p>
        <AddToCart p={p} />
      </div>
    </li>
  )
}
