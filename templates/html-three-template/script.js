import {
  WebGLRenderer, 
  PerspectiveCamera,    
  Scene, 
  Mesh, 
  BoxGeometry,
  MeshNormalMaterial,
  Clock 
} from "./three.module.js";

import { OrbitControls } from "./OrbitControls.js";

// If you want to create OBJKT's with different seeds, 
// you can access the creator and viewer wallet ids. 
// This values will only be injected once the piece 
// has been minted they will not work locally.
// If the user is not sync, the viewer comes in as false.
const creator = new URLSearchParams(window.location.search).get('creator');
const viewer = new URLSearchParams(window.location.search).get('viewer');

console.log('NFT created by', creator);
console.log('NFT viewed by', viewer);

class Sketch {
  constructor() {
    this.renderer = new WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.scene = new Scene();

    this.canvas = null;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.clock = new Clock();

    this.resize();
    this.init();
  }

  init() {
    this.addCanvas();
    this.addEvents();
    this.addElements();
    this.render();
  }

  addCanvas() {
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);
  }

  addEvents() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  addElements() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();
    const mesh = new Mesh(geometry, material);

    this.scene.add(mesh);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.controls.update();

    this.scene.children[0].rotation.x = this.clock.getElapsedTime() * 0.35;
    this.scene.children[0].rotation.y = this.clock.getElapsedTime() * 0.35;

    this.renderer.setAnimationLoop(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch();
