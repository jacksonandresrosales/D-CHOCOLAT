# D'CHOCOLAT

Landing page y tienda de chocolate artesanal ecuatoriano, hecha con React + Vite.
La mascota, **Cacaíto**, es una tableta de chocolate con estilo de dibujo animado de los años 30.

## Páginas

- **Inicio**: portada, selector de intensidad de cacao, proceso "del árbol a la tableta" y la carta con precios.
- **Chocolates**: catálogo con filtros y orden.
- **Sugerencias**: test de 3 preguntas que recomienda un chocolate y buzón de sugerencias.
- **Carrito**: cantidades, entrega y envío del pedido por WhatsApp.

## Cómo correrlo

```bash
npm install
npm run dev
```

Para producción: `npm run build` (genera la carpeta `dist/`).

## Configuración

- Número de WhatsApp y costo de envío: `src/config.js`
- Productos y precios: `src/data/products.js`

## Fotografías

Las fotos de cacao son de Wikimedia Commons, con licencias libres. Los créditos están en el pie de la página y en `src/data/credits.json`.
