'use strict'

const sW = 800
const sH = 800
const sD = 800
const range = 50
const numLines = 50
const lerpSpeed = 0.1
const bgOdds = 0.01

let pg
let target, pos

function setup() {
  createCanvas(windowHeight, windowHeight)
  pg = createGraphics(sW, sH, WEBGL)

  pixelDensity(1)
  noCursor()
  frameRate(60)

  noStroke()
  fill(0, 15)
  background(0)
  pg.strokeWeight(1)

  target = createVector(0, 0, 0)
  pos = createVector(0, 0, 0)
}

function draw() {
  pos = p5.Vector.lerp(pos, target, lerpSpeed)
  if (pos.dist(target) < range * 2) {
    let x = random(-sW / 2, sW / 2)
    let y = random(-sH / 2, sH / 2)
    let z = random(-sD / 2, sD / 2)
    target = createVector(x, y, z)
  }

  if (random(0, 1) < bgOdds) pg.background(0)

  pg.stroke(0, 245, 255)
  pg.fill(0, 127, 255, 130)

  drawLines()

  pg.stroke(255, 245, 0)
  pg.fill(255, 127, 0, 130)

  drawLines()

  image(pg, 0, 0, width, height)
}

function windowResized() {
  resizeCanvas(windowHeight, windowHeight)
}

function drawLines() {
  pg.push()
  pg.translate(pos.x, pos.y, pos.z)
  pg.beginShape(LINES)
  for (let i = 0; i < numLines; i++) {
    let x = random(-range, range)
    let y = random(-range, range)
    let z = random(-range, range)
    pg.vertex(x, y, z)
  }
  pg.endShape()
  pg.pop()
}
