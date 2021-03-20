import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

export const Hicetnunc = ({ metadata, src, interactive }) => {
  const ref = useRef()
  const canvas = useRef()
  const [width, setWidth] = useState('100px')
  const [height, setHeight] = useState('100px')
  const [script, setScript] = useState()
  let raf
  let ctx
  let now

  const handleResize = () => {
    const { width, height } = ref.current.getBoundingClientRect()
    setWidth(width)
    setHeight(height)
  }

  useEffect(() => {
    handleResize()
    global.addEventListener('resize', handleResize)

    return () => {
      global.removeEventListener('resize', handleResize)
    }
  }, [width, height])

  useEffect(() => {
    // loads javascript without injecting it into the page.
    // hopefully making it safe, as we only access certain props inside the returning javascript
    const client = new XMLHttpRequest()
    client.open('GET', src)
    client.onload = (e) => {
      setScript(eval(client.responseText)) // eslint-disable-line
    }
    client.send()

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [])

  // once script gets loaded
  useEffect(() => {
    if (script) {
      // check which template to load.
      // in this case "canvas", but there could be others. like fragmentshader renderer, three.js, etc
      if (script.type === 'canvas') {
        now = Date.now()
        ctx = canvas.current.getContext('2d')
        script.setup({ metadata })
        update()
      } else {
        alert(`unknown type ${script.type}`)
      }
    }
  }, [script])

  const update = () => {
    const timestamp = (Date.now() - now) / 1000
    script.update({ ctx, timestamp })
    raf = requestAnimationFrame(update)
  }

  return (
    <div className={styles.container} ref={ref}>
      <canvas ref={canvas} width="300px" height="300p" />
    </div>
  )
}
