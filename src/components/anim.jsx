import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1]
export const spring = { type: 'spring', stiffness: 260, damping: 18 }

// Aparición al entrar en pantalla (una sola vez).
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 0.8, ease, delay },
})

// Titular cuyas líneas suben desde una máscara. onMount: anima al cargar en vez de al hacer scroll.
// El disparador va en el titular (visible), no en las líneas: escondidas tras la máscara nunca "entran" en pantalla.
const lineVariants = {
  hidden: { y: '110%' },
  show: (d) => ({ y: '0%', transition: { duration: 0.95, ease, delay: d } }),
}
export function Lines({ lines, as = 'h2', className = '', id, delay = 0, onMount = false }) {
  const Tag = motion[as]
  const trigger = onMount
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Tag className={`lines ${className}`} id={id} initial="hidden" {...trigger}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((l, i) => (
        <span className="ln" key={i} aria-hidden="true">
          <motion.span className="ln__in" variants={lineVariants} custom={delay + i * 0.12}>
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// Número que cuenta desde 0 cuando aparece.
export function Counter({ to, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const value = useMotionValue(reduce ? to : 0)
  const text = useTransform(value, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`)
  useEffect(() => {
    if (!inView) return
    if (reduce) return value.set(to)
    const c = animate(value, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [inView, reduce, to, value])
  return (
    <>
      <span className="sr-only">{`${prefix}${to.toFixed(decimals)}${suffix}`}</span>
      <motion.span ref={ref} aria-hidden="true">
        {text}
      </motion.span>
    </>
  )
}

// Valor que se mueve con el scroll mientras el elemento cruza la pantalla.
// Con movimiento reducido devuelve undefined (el estilo queda quieto).
export function useScrollValue(ref, input, output, offset = ['start end', 'end start']) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const v = useTransform(scrollYProgress, input, output)
  return reduce ? undefined : v
}
