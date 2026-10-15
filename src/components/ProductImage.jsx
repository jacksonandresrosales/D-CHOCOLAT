import { useState } from 'react'
import ProductArt from './ProductArt'
import { imgSrc } from '../data/products'

// Foto del producto: muestra el color de fondo de la foto mientras carga y aparece suave.
// Si la foto falla, cae al dibujo SVG del empaque.
export default function ProductImage({ p, sizes = '(max-width: 560px) 92vw, 360px', eager = false, className = '' }) {
  const [estado, setEstado] = useState('cargando')
  if (estado === 'error') return <ProductArt p={p} className={`pimg pimg--art ${className}`} />
  return (
    <span className={`pimg pimg--${p.fondo || 'yellow'} ${estado === 'listo' ? 'is-loaded' : ''} ${className}`}>
      <img
        ref={(el) => {
          if (el?.complete && el.naturalWidth && estado === 'cargando') setEstado('listo')
        }}
        src={imgSrc(p, 960)}
        srcSet={`${imgSrc(p, 480)} 480w, ${imgSrc(p, 960)} 960w`}
        sizes={sizes}
        width="960"
        height="960"
        alt={p.alt || `${p.nombre} de D'CHOCOLAT`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
        onLoad={() => setEstado('listo')}
        onError={() => setEstado('error')}
      />
    </span>
  )
}
