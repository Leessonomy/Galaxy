import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

scene.fog = new THREE.FogExp2(0xebe2db, 0.00003);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }
);

camera.position.set(0, 0, 20);
scene.background = new THREE.Color(0x000000);

document.body.appendChild(renderer.domElement);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMappingExposure = 0.5;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableZoom = true;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const composer = new EffectComposer(renderer, renderTarget);

const renderEffect = new RenderPass(scene, camera);

const bloomEffect = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);

const shader = {
  uniforms: {
    baseTexture: {
      value: THREE.Texture,
    },
    bloomTexture: { value: composer.renderTarget2.texture },
    bloomIntensity: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;
    uniform float bloomIntensity;
    varying vec2 vUv;

    void main() {
    vec4 bloom = texture2D(bloomTexture, vUv) * bloomIntensity;
    vec4 color = texture2D(baseTexture, vUv);
    vec3 combined = max(bloom.rgb, color.rgb);
    gl_FragColor = vec4(combined, 1.0);
    }
`,
};

const shaderEffect = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: shader.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
  }),
  "baseTexture"
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export {
  scene,
  camera,
  controls,
  renderer,
  composer,
  bloomEffect,
  renderEffect,
  shaderEffect,
};
