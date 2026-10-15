import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductArt from '../components/ProductArt'
import useReveal from '../components/useReveal'
import { useCart } from '../context/CartContext'
import { CATEGORIAS, PRODUCTOS } from '../data/products'
import { usd } from '../config'

const ORDEN = {
  destacados: { label: 'Destacados', fn: () => 0 },
  barato: { label: 'Precio: menor a mayor', fn: (a, b) => a.precio - b.precio },
  caro: { label: 'Precio: mayor a menor', fn: (a, b) => b.precio - a.precio },
  intenso: { label: 'Más cacao primero', fn: (a, b) => b.pct - a.pct },
}

export default function Chocolates() {
  const { agregar, lineas } = useCart()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'todos'
  const [orden, setOrden] = useState('destacados')

  const lista = useMemo(
    () => PRODUCTOS.filter((p) => cat === 'todos' || p.cat === cat).sort(ORDEN[orden].fn),
    [cat, orden],
  )
  useReveal([cat, orden])
  const enCarrito = (id) => lineas.find((l) => l.producto.id === id)?.qty || 0

  return (
    <div className="page">
      <header className="page__head">
        <h1 data-reveal>Nuestros chocolates</h1>
        <p data-reveal>Once maneras de comer cacao ecuatoriano. Añade los que quieras y envía tu pedido por WhatsApp.</p>
      </header>

      <div className="filters">
        <div className="chips" role="group" aria-label="Filtrar por tipo">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              className="chip"
              aria-pressed={cat === c.id}
              onClick={() => setParams(c.id === 'todos' ? {} : { cat: c.id }, { replace: true })}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        <label className="sort">
          Ordenar
          <select value={orden} onChange={(e) => setOrden(e.target.value)}>
            {Object.entries(ORDEN).map(([k, o]) => (
              <option key={k} value={k}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="count" aria-live="polite">
        {lista.length} {lista.length === 1 ? 'producto' : 'productos'}
      </p>

      <ul className="shelf">
        {lista.map((p) => {
          const q = enCarrito(p.id)
          return (
            <li key={p.id} className="item" data-reveal>
              <div className={`item__plate item__plate--${p.wrap === 'red' ? 'yellow' : p.wrap === 'yellow' ? 'red' : 'yellow'}`}>
                <ProductArt p={p} />
              </div>
              <div className="item__body">
                <div className="item__title">
                  <h2>{p.nombre}</h2>
                  <span className="item__price">{usd(p.precio)}</span>
                </div>
                <p className="item__meta">
                  {p.notas} · {p.peso}
                </p>
                <p>{p.desc}</p>
                <p className="item__origin">Origen: {p.origen}</p>
                <button className="btn btn--block" onClick={() => agregar(p.id)}>
                  {q ? `Añadir otro (${q} en el carrito)` : 'Añadir al carrito'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
