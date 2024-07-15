import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GalaxyCurve } from "./galaxy";
import { Star } from "./object";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 20);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

const renderScene = new RenderPass(scene, camera);

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  2.6, // strength
  1.5, // radius
  0.1 // threshold
);
bloom.renderToScreen = true;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloom);

const ambientLight = new THREE.AmbientLight(0x404040);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(50, 50, 50);

scene.add(ambientLight);
scene.add(pointLight);

const curveConfig = {
  radius: 200,
  numPoints: 400,
  turns: 5,
  noiseScale: 5,
};

const galaxyCurve = new GalaxyCurve(curveConfig);

const points = galaxyCurve.create();

const curve = new THREE.CatmullRomCurve3(points);

const numPlanets = Math.floor(curve.getLength() / 5);

for (let i = 0; i < numPlanets; i++) {
  const index = Math.floor((i * points.length) / numPlanets);

  const star = new Star(points[index]);

  star.add(scene);
}

const pointsPath = curve.getPoints(50);
const lineGeo = new THREE.BufferGeometry().setFromPoints(pointsPath);
const lineMaterial = new THREE.LineBasicMaterial({
  opacity: 0,
  transparent: true,
});

const pathLine = new THREE.Line(lineGeo, lineMaterial);

scene.add(pathLine);

console.log(curve, "curve");

const clock = new THREE.Clock();
const speed = 0.001;
let time = 1;

function animate() {
  const delta = clock.getDelta();
  time -= speed * delta;

  if (time < 0) {
    time = 0;
  }

  const point = curve.getPointAt(time);
  const nextPoint = curve.getPointAt(Math.max(time - speed * delta, 0));
  camera.position.copy(point);

  camera.lookAt(nextPoint);
  const direction = new THREE.Vector3()
    .subVectors(point, nextPoint)
    .normalize();
  const up = new THREE.Vector3(0, 0, 1);
  const axis = new THREE.Vector3().crossVectors(up, direction).normalize();
  const angle = Math.acos(up.dot(direction));
  camera.quaternion.setFromAxisAngle(axis, angle);
  renderer.render(scene, camera);

  composer.render();

  if (time > 0) {
    requestAnimationFrame(animate);
  }
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
