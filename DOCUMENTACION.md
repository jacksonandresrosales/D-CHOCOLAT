# Documentación — D'CHOCOLAT

Landing page y tienda en línea de chocolate artesanal ecuatoriano. Proyecto hecho con **React 18 + Vite**, animaciones con **Motion** y navegación con **React Router**.

## 1. Objetivo

Presentar la marca D'CHOCOLAT con un diseño cálido que anime a comprar, mostrar los productos, recomendar chocolates y recibir pedidos por WhatsApp.

## 2. Línea de diseño

| Elemento | Decisión |
|---|---|
| Idea | La página es la envoltura de una tableta: franjas de toldo, bordes de papel cortado y tintas de imprenta. |
| Colores | Rojo `#d62b1f`, amarillo `#ffc21a`, cacao `#2b160d` y papel `#f5ebdd`. |
| Tipografía | Fraunces (Google Fonts), una serif redondeada con aire de etiqueta antigua. |
| Mascota | **Cacaíto**: una tableta de chocolate original en SVG, con estilo de dibujo animado de los años 30 (ojos de pastel, guantes blancos y zapatones). Cambia de cara: feliz, dulce, intenso y triste. |
| Fotos | Productos: imágenes referenciales generadas con IA. Cacao: Wikimedia Commons, con licencia libre. |

## 3. Páginas

| Ruta | Página | Qué hace |
|---|---|---|
| `/` | Inicio | Portada, "Del árbol, a mano", cinta del taller, selector de intensidad, proceso, carta y cierre. |
| `/chocolates` | Tienda | Catálogo con filtros por tipo y orden por precio o intensidad. |
| `/chocolates/:id` | Ficha | Foto, precio, notas de cata, origen, medidor de cacao y productos relacionados. |
| `/sugerencias` | Sugerencias | Test de 3 preguntas que recomienda un chocolate, y buzón de sugerencias. |
| `/carrito` | Carrito | Cantidades, entrega, envío gratis desde $25 y envío del pedido por WhatsApp. |
| `/creditos` | Créditos | Autores y licencias de las fotos. |

## 4. Funciones principales

- **Carrito persistente:** se guarda en `localStorage` y se mantiene al recargar.
- **Botón "Añadir" inteligente:** al añadir se convierte en un selector `− n +` y una miniatura del producto vuela hasta el carrito.
- **Pedido por WhatsApp:** arma el mensaje con productos, total, envío y dirección.
- **Envío gratis:** una barra de progreso muestra cuánto falta para llegar a $25.
- **Recomendador:** asigna puntos a cada producto según gusto, ingrediente y uso.
- **Barra del carrito en el teléfono:** queda fija abajo con el total y un botón para ver el carrito.

## 5. Animaciones de scroll (inicio)

| Sección | Animación |
|---|---|
| Portada | El toldo cae al cargar, Cacaíto entra rebotando y la foto se acerca al bajar. |
| Títulos | Las líneas suben desde una máscara al aparecer. |
| Cifras | Los números cuentan desde cero. |
| Cinta del taller | La sección queda fija y los 11 productos avanzan de lado, con rodillos que giran. |
| Proceso | El recibo se "imprime" a medida que bajas. |
| La carta | La hoja sube girando. |
| Cierre | Las letras rebotan y Cacaíto se asoma desde abajo. |
| Footer | Los bloques del logo crecen. |

Si el sistema tiene activado "reducir movimiento", las animaciones se desactivan y la cinta pasa a ser una fila que se desliza con el dedo.

## 6. Estructura del proyecto

```
├── index.html
├── public/
│   └── img/              fotos de cacao (WebP) y productos/ (480 y 960 px)
└── src/
    ├── main.jsx          rutas y configuración de animaciones
    ├── config.js         WhatsApp, costo de envío, envío gratis
    ├── styles.css        todos los estilos
    ├── context/
    │   └── CartContext.jsx   estado del carrito
    ├── data/
    │   ├── products.js       catálogo, fotos y relacionados
    │   └── credits.json      créditos de las fotos
    ├── components/
    │   ├── Layout.jsx        menú, footer, aviso y barra del carrito
    │   ├── Mascot.jsx        Cacaíto (SVG)
    │   ├── ProductImage.jsx  foto con carga suave y respaldo en SVG
    │   ├── ProductArt.jsx    dibujo SVG del empaque (respaldo)
    │   ├── ProductCard.jsx   tarjeta de producto
    │   ├── AddToCart.jsx     botón añadir / selector de cantidad
    │   ├── anim.jsx          títulos animados, contadores, scroll
    │   ├── fly.js            animación "volar al carrito"
    │   ├── edges.js          bordes de papel en zigzag
    │   └── useReveal.js      aparición al hacer scroll
    └── pages/
        ├── Home.jsx  Chocolates.jsx  Producto.jsx
        ├── Sugerencias.jsx  Carrito.jsx  Creditos.jsx
```

## 7. Instalación y uso

Requisitos: Node.js 18 o superior.

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # versión de producción en dist/
npm run preview  # prueba la versión de producción
```

## 8. Configuración

| Qué cambiar | Archivo |
|---|---|
| Número de WhatsApp (formato `593…` sin "+") | `src/config.js` → `WHATSAPP` |
| Costo de envío y monto para envío gratis | `src/config.js` → `ENVIO`, `ENVIO_GRATIS` |
| Productos, precios, descripciones | `src/data/products.js` |
| Fotos de producto | `public/img/productos/<id>-480.webp` y `-960.webp` |

## 9. Accesibilidad y rendimiento

- Navegación con teclado, enlace "Saltar al contenido" y foco visible.
- Textos alternativos en todas las fotos y formularios con errores claros.
- Contraste de texto de 4.5:1 o más.
- Botones de al menos 44 px en pantallas táctiles.
- Imágenes WebP en dos tamaños (`srcset`) con carga diferida.
- Diseño adaptable a escritorio, tableta y teléfono.

## 10. Tecnologías

React 18 · Vite 5 · React Router 6 · Motion · CSS puro (sin frameworks) · Google Fonts (Fraunces).

## 11. Pendiente antes de publicar

- Poner el número real de WhatsApp.
- Confirmar productos, precios, horarios y el monto de envío gratis (son de ejemplo).
- Reemplazar las fotos de IA por fotos reales de los productos, si las hay.
