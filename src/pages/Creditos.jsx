import { Link } from 'react-router-dom'
import credits from '../data/credits.json'

export default function Creditos() {
  return (
    <div className="page credits">
      <header className="page__head">
        <h1>Créditos</h1>
        <p>
          Las fotos del cacao muestran su mundo, no nuestros productos. Las fotos de producto son imágenes referenciales generadas con IA.{' '}
          <Link to="/">Volver al inicio</Link>.
        </p>
      </header>
      <ul className="credits__list">
        {credits.map((c) => (
          <li key={c.page}>
            <a href={c.page} target="_blank" rel="noreferrer">
              {c.title}
            </a>
            <span>
              {c.creator ? c.creator.split(';')[0] : 'Autor desconocido'} · {c.license} · vía {c.via}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
