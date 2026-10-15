# D'CHOCOLAT

Landing page y tienda de chocolate artesanal ecuatoriano, hecha con React + Vite.
La mascota, **Cacaíto**, es una tableta de chocolate con estilo de dibujo animado de los años 30.

📄 **Documentación completa:** [DOCUMENTACION.md](DOCUMENTACION.md)

## Páginas

- **Inicio**: portada animada, "La cinta del taller" (los chocolates avanzan mientras bajas), selector de intensidad de cacao, el proceso como un recibo que se imprime con el scroll y la carta con precios.
- **Chocolates**: catálogo con filtros y orden; cada producto tiene su ficha (`/chocolates/:id`).
- **Sugerencias**: test de 3 preguntas que recomienda un chocolate y buzón de sugerencias.
- **Carrito**: cantidades, envío gratis desde $25, sugerencias para completar el pedido y envío del pedido por WhatsApp.

## Cómo correrlo

```bash
npm install
npm run dev
```

Para producción: `npm run build` (genera la carpeta `dist/`).

## Configuración

- Número de WhatsApp, costo de envío y monto para envío gratis: `src/config.js`
- Productos, precios y fotos: `src/data/products.js`

## Animaciones y accesibilidad

Las animaciones usan [Motion](https://motion.dev). Si el sistema tiene activado "reducir movimiento", se desactivan y la cinta del taller pasa a ser una fila que se desliza con el dedo.

## Imágenes

- Fotos de producto (`public/img/productos`): imágenes referenciales generadas con IA.
- Fotos de cacao: Wikimedia Commons, con licencias libres. Los créditos están en la página `/creditos`.
