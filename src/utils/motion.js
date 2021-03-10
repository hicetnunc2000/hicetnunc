export const fadeIn = () => {
  return {
    initial: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    animate: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }
}
