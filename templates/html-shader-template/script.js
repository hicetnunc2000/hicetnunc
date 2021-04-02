const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const gl = canvas.getContext('webgl')

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resize()

window.addEventListener('resize', resize)

const mouse = { x: 0, y: 0 }

document.body.addEventListener('pointermove', function (e) {
  mouse.x = e.pageX
  mouse.y = e.pageY
})

const vertexShaderSource = `attribute vec2 aVertexPosition;
void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}`

var fragmentShaderSource = `#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
uniform float uTime;
uniform vec2 uPosition;

#define PI 3.14159

void main() {
  float v = uTime +uPosition.x / 100.;
  float k = .01;
  vec2 c = gl_FragCoord.xy * k - k/2.0;
  v += sin(c.x+uTime);
  v += sin((c.y+uTime)/2.0);
  v += sin((c.x+c.y+uTime)/2.0);
  c += k/2.0 * vec2(sin(uTime/3.0), cos(uTime/2.0));
  v += sin(sqrt(c.x*c.x+c.y*c.y+1.0)+uTime+uPosition.y/100.);
  v = v/2.0;
  vec3 col = vec3(1, .5 + .5 * sin(PI*v), .5 + .5 * cos(PI*v));
  gl_FragColor = vec4(col, 1);
}`

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentShaderSource)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

const vertices = new Float32Array([-1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1])

const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

const itemSize = 2
const numItems = vertices.length / itemSize

program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition')
gl.enableVertexAttribArray(program.aVertexPosition)
gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0)

gl.useProgram(program)

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  program.uColor = gl.getUniformLocation(program, 'uColor')
  gl.uniform4fv(program.uColor, [0.0, 0.0, 0.0, 1.0])

  program.uPosition = gl.getUniformLocation(program, 'uPosition')
  gl.uniform2fv(program.uPosition, [mouse.x, mouse.y])

  program.uTime = gl.getUniformLocation(program, 'uTime')
  gl.uniform1f(program.uTime, 0.001 * performance.now())

  gl.drawArrays(gl.TRIANGLES, 0, numItems)

  requestAnimationFrame(render)
}

render()
