module.exports = {
  // specify the type of renderer
  type: 'canvas',

  // specify the ratio
  ratio: 1 / 1,

  // setup receives props
  setup(props) {
    console.log('props', props)
  },

  // call on every raf
  update(props) {
    const { ctx, timestamp } = props
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.arc(
      ctx.canvas.width * 0.5,
      ctx.canvas.height * 0.5,
      (0.5 + 0.5 * Math.cos(timestamp)) * 100,
      0,
      2 * Math.PI
    )
    ctx.stroke()
  },
}
