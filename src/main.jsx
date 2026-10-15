import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import Mascot from './components/Mascot'
import Home from './pages/Home'
import Chocolates from './pages/Chocolates'
import Producto from './pages/Producto'
import Sugerencias from './pages/Sugerencias'
import Carrito from './pages/Carrito'
import Creditos from './pages/Creditos'
import './styles.css'

function NoEncontrada() {
  return (
    <div className="page empty">
      <Mascot mood="triste" size={200} />
      <h1>Esta página se derritió</h1>
      <Link className="btn" to="/">
        Volver al inicio
      </Link>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Con "reducir movimiento" activado en el sistema, las animaciones se saltan al estado final. */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="chocolates" element={<Chocolates />} />
              <Route path="chocolates/:id" element={<Producto />} />
              <Route path="sugerencias" element={<Sugerencias />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="creditos" element={<Creditos />} />
              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>,
)
