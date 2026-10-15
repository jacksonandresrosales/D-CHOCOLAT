import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { imgSrc } from '../data/products'
import { usd } from '../config'
import { flyToCart } from './fly'

// Botón "Añadir" que, una vez en el carrito, se convierte en selector de cantidad (− n +).
// variant: 'full' (botón ancho) · 'cell' (celda de la vitrina) · 'compact' (botón redondo "+")
export default function AddToCart({ p, variant = 'full', label }) {
  const { qtyDe, agregar, fijar } = useCart()
  const q = qtyDe(p.id)
  const addRef = useRef(null)
  const plusRef = useRef(null)
  const foco = useRef(null) // a qué control devolver el foco cuando cambia la forma

  useEffect(() => {
    if (foco.current === 'plus' && plusRef.current) plusRef.current.focus()
    if (foco.current === 'add' && addRef.current) addRef.current.focus()
    foco.current = null
  }, [q > 0])

  const sumar = (el) => {
    agregar(p.id, 1, { avisar: q === 0 })
    flyToCart(el, imgSrc(p, 480))
  }

  if (q === 0) {
    const clases = { full: 'btn btn--block', cell: 'cell cell--ink', compact: 'add-mini' }[variant]
    return (
      <button
        ref={addRef}
        type="button"
        className={clases}
        onClick={(e) => {
          foco.current = 'plus'
          sumar(e.currentTarget)
        }}
        aria-label={variant === 'compact' ? `Añadir ${p.nombre} al carrito` : undefined}
      >
        {variant === 'compact'
          ? '+'
          : label || (
              <>
                Añadir<span className="btn__extra"> al carrito · {usd(p.precio)}</span>
              </>
            )}
      </button>
    )
  }

  return (
    <div className={`qty qty--${variant}`} role="group" aria-label={`Cantidad de ${p.nombre} en tu carrito`}>
      <button
        type="button"
        onClick={() => {
          if (q === 1) foco.current = 'add'
          fijar(p.id, q - 1)
        }}
        aria-label={q === 1 ? `Quitar ${p.nombre} del carrito` : `Quitar uno de ${p.nombre}`}
      >
        −
      </button>
      <span aria-live="polite">
        {q}
        {variant !== 'compact' && <small> en tu carrito</small>}
      </span>
      <button ref={plusRef} type="button" onClick={(e) => sumar(e.currentTarget)} aria-label={`Añadir otro ${p.nombre}`}>
        +
      </button>
    </div>
  )
}
