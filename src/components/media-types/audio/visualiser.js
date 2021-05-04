import { createRef, PureComponent } from 'react'

export class Visualiser extends PureComponent {
  ref = createRef()

  componentDidMount() {
    this.ctx = this.ref.current.getContext('2d')
    this.ratio = Math.max(1, Math.min(global.devicePixelRatio, 2))
  }

  componentDidUpdate() {
    this.resize()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf)
  }

  init() {
    this.audio = new Audio()
    this.audio.src = this.props.src
    this.audio.controls = false
    this.audio.loop = true
    this.audio.autoplay = false
    this.audio.crossOrigin = 'anonymous'

    this.audioCtx = new AudioContext()

    this.analyser = this.audioCtx.createAnalyser()
    // this.analyser.fftSize = 2048

    this.source = this.audioCtx.createMediaElementSource(this.audio)
    this.source.connect(this.analyser)

    this.source.connect(this.audioCtx.destination)

    this.data = new Float32Array(this.analyser.frequencyBinCount)
    this.analyser.getFloatTimeDomainData(this.data)

    this.style = getComputedStyle(document.body)
  }

  play() {
    this.audio.play()

    this.raf = requestAnimationFrame(this.update)
  }

  pause(reset) {
    this.audio.pause()

    cancelAnimationFrame(this.raf)

    if (reset) {
      this.audio.currentTime = 0
    }
  }

  resize() {
    const width = 320
    const height = 320
    this.ctx.canvas.width = width * this.ratio
    this.ctx.canvas.height = height * this.ratio
    this.ctx.canvas.style.width = `${width}px`
    this.ctx.canvas.style.height = `${height}px`
  }

  update = () => {
    // this.analyser.getByteFrequencyData(this.data)
    this.analyser.getFloatTimeDomainData(this.data)

    this.resize()

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    // FIRST OPTION (traditional)
    // let space = this.ctx.canvas.width / this.data.length
    // this.data.forEach((value, i) => {
    //   this.ctx.beginPath()
    //   this.ctx.strokeStyle = 'red'
    //   this.ctx.moveTo(space * i, this.ctx.canvas.height) //x,y
    //   this.ctx.lineTo(space * i, this.ctx.canvas.height - value) //x,y
    //   this.ctx.stroke()
    // })

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.beginPath()

    for (let i = 0; i < this.data.length; i++) {
      const x = i
      const y = (0.5 + this.data[i] / 2) * this.ctx.canvas.height

      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }

    this.ctx.strokeStyle = this.style.getPropertyValue('--text-color')
    this.ctx.lineWidth = 2 * global.devicePixelRatio
    this.ctx.stroke()
    this.raf = requestAnimationFrame(this.update)
  }

  render() {
    return <canvas ref={this.ref}></canvas>
  }
}
