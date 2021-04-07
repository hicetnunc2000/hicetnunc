import { createRef, PureComponent } from 'react'

export class Visualiser extends PureComponent {
  ref = createRef()
  userTouched = false

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

  init = () => {
    if (this.userTouched === false) {
      this.userTouched = true
      this.setup()
      this.update()
    }
  }

  setup() {
    this.audio = new Audio()
    this.audio.src = this.props.src
    this.audio.controls = false
    this.audio.loop = true
    this.audio.autoplay = true
    this.audio.crossOrigin = 'anonymous'

    this.audioCtx = new AudioContext()

    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = 2048

    this.source = this.audioCtx.createMediaElementSource(this.audio)
    this.source.connect(this.analyser)

    this.source.connect(this.audioCtx.destination)

    this.data = new Uint8Array(this.analyser.frequencyBinCount)
  }

  resize() {
    const width = 300
    const height = 300
    this.ctx.canvas.width = width * this.ratio
    this.ctx.canvas.height = height * this.ratio
    this.ctx.canvas.style.width = `${width}px`
    this.ctx.canvas.style.height = `${height}px`
    this.ctx.canvas.style.border = '1px dashed red'
  }

  update = () => {
    this.analyser.getByteFrequencyData(this.data)

    this.resize()

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    // FIRST OPTION (traditional)
    // let space = this.ctx.canvas.width / this.data.length
    // this.data.forEach((value, i) => {
    //   this.ctx.beginPath()
    //   this.ctx.moveTo(space * i, this.ctx.canvas.height) //x,y
    //   this.ctx.lineTo(space * i, this.ctx.canvas.height - value) //x,y
    //   this.ctx.stroke()
    // })

    // SECOND OPTION (radial)
    // const bars = 200 // 256
    // const bar_width = 1
    // const center_x = this.ctx.canvas.width / 2
    // const center_y = this.ctx.canvas.height / 2
    // const radius = 10

    // for (var i = 0; i < bars; i++) {
    //   const rads = (Math.PI * 2) / bars
    //   const bar_height = this.data[i] * 0.5

    //   // set coordinates
    //   const x = center_x + Math.cos(rads * i) * radius
    //   const y = center_y + Math.sin(rads * i) * radius
    //   const x_end = center_x + Math.cos(rads * i) * (radius + bar_height)
    //   const y_end = center_y + Math.sin(rads * i) * (radius + bar_height)

    //   //draw a bar
    //   this.ctx.strokeStyle = 'black'
    //   this.ctx.lineWidth = bar_width
    //   this.ctx.beginPath()
    //   this.ctx.moveTo(x, y)
    //   this.ctx.lineTo(x_end, y_end)
    //   this.ctx.stroke()
    // }

    // THIRD OPTION (wave)

    if (!this.userTouched) {
      console.log(this.img)
      this.ctx.fillStyle = 'black'
      this.ctx.drawImage(this.img, 0, 0)
    } else {
      var barWidth = (this.ctx.canvas.width / this.data.length) * 4
      var barHeight
      var x = 0

      for (var i = 0; i < this.data.length; i++) {
        barHeight = this.data[i] / 2

        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(
          x,
          this.ctx.canvas.height - barHeight / 2,
          barWidth,
          barHeight
        )

        x += barWidth + 1
      }

      this.ctx.stroke()
    }
    this.raf = requestAnimationFrame(this.update)
  }

  render() {
    return <canvas ref={this.ref} onClick={this.init}></canvas>
  }
}
