import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import useReveal from '../components/useReveal'
import { CATEGORIAS, PRODUCTOS } from '../data/products'

const ORDEN = {
  destacados: { label: 'Destacados', fn: () => 0 },
  barato: { label: 'Precio: menor a mayor', fn: (a, b) => a.precio - b.precio },
  caro: { label: 'Precio: mayor a menor', fn: (a, b) => b.precio - a.precio },
  intenso: { label: 'Más cacao primero', fn: (a, b) => b.pct - a.pct },
}

export default function Chocolates() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'todos'
  const [orden, setOrden] = useState('destacados')

  const lista = useMemo(
    () => PRODUCTOS.filter((p) => cat === 'todos' || p.cat === cat).sort(ORDEN[orden].fn),
    [cat, orden],
  )
  useReveal([cat, orden])

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
        {lista.map((p) => (
          <ProductCard key={p.id} p={p} sizes="(max-width: 560px) 46vw, (max-width: 1200px) 45vw, 320px" />
        ))}
      </ul>
    </div>
  )
}
