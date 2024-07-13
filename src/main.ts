import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GalaxyCurve } from "./galaxy";

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

const ambientLight = new THREE.AmbientLight(0x404040);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(50, 50, 50);

scene.add(ambientLight);
scene.add(pointLight);

const points = new GalaxyCurve({
  radius: 200,
  numPoints: 200,
  turns: 5,
  noiseScale: 5,
}).create();

const curve = new THREE.CatmullRomCurve3(points);

const planetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

for (let i = 0; i < points.length; i++) {
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.copy(points[i]);
  scene.add(planet);
}

const pointsPath = curve.getPoints(50);
const pathGeometry = new THREE.BufferGeometry().setFromPoints(pointsPath);
const pathMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const pathLine = new THREE.Line(pathGeometry, pathMaterial);

scene.add(pathLine);

console.log(curve, "curve");

const clock = new THREE.Clock();
const speed = 0.01;
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
