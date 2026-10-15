// Una miniatura del producto "vuela" en arco hasta el carrito de la barra de navegación.
export function flyToCart(fromEl, src) {
  if (!fromEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const to = document.querySelector('[data-cart-target]')
  if (!to || !to.animate) return

  const a = fromEl.getBoundingClientRect()
  const b = to.getBoundingClientRect()
  const size = 76
  const ghost = document.createElement('img')
  ghost.src = src
  ghost.alt = ''
  ghost.className = 'fly'
  ghost.style.left = `${a.left + a.width / 2 - size / 2}px`
  ghost.style.top = `${a.top + a.height / 2 - size / 2}px`
  ghost.style.width = `${size}px`
  ghost.style.height = `${size}px`
  document.body.appendChild(ghost)

  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const vuelo = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(.5) rotate(0deg)', opacity: 0 },
      { transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 110}px) scale(1) rotate(-14deg)`, opacity: 1, offset: 0.4 },
      { transform: `translate(${dx}px, ${dy}px) scale(.22) rotate(-36deg)`, opacity: 0.5 },
    ],
    { duration: 780, easing: 'cubic-bezier(.45, 0, .55, 1)' },
  )
  vuelo.onfinish = () => {
    ghost.remove()
    to.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18) rotate(-5deg)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
    )
  }
  vuelo.oncancel = () => ghost.remove()
}
