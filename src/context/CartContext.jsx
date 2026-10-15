import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { porId } from '../data/products'

const CartContext = createContext(null)
const KEY = 'dchocolat-carrito'

function cargar() {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : {}
    // descarta productos que ya no existen en el catálogo
    return Object.fromEntries(Object.entries(data).filter(([id, q]) => porId(id) && q > 0))
  } catch {
    return {}
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const q = Math.min(99, (state[action.id] || 0) + (action.qty || 1))
      return { ...state, [action.id]: q }
    }
    case 'set': {
      const next = { ...state }
      if (action.qty <= 0) delete next[action.id]
      else next[action.id] = Math.min(99, action.qty)
      return next
    }
    case 'clear':
      return {}
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, cargar)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* almacenamiento no disponible: el carrito vive solo en memoria */
    }
  }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const value = useMemo(() => {
    const lineas = Object.entries(items).map(([id, qty]) => ({ producto: porId(id), qty }))
    const cantidad = lineas.reduce((s, l) => s + l.qty, 0)
    const subtotal = lineas.reduce((s, l) => s + l.qty * l.producto.precio, 0)
    return {
      lineas,
      cantidad,
      subtotal,
      toast,
      agregar: (id, qty = 1) => {
        dispatch({ type: 'add', id, qty })
        setToast({ id, key: Date.now() })
      },
      fijar: (id, qty) => dispatch({ type: 'set', id, qty }),
      vaciar: () => dispatch({ type: 'clear' }),
    }
  }, [items, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
