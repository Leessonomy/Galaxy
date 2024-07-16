import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import { GalaxyCurve } from "./galaxy";
import { Star } from "./star";
import { CurveParams } from "./global.config";

import { scene, camera, renderer, controls, composer } from "./setup";

let curve: THREE.CatmullRomCurve3;

const clock = new THREE.Clock();
let time = 1;
let speed = 0.001;

function setStarsOnCurve() {
  const numPlanets = Math.floor(curve.getLength() / 5);

  for (let i = 0; i < numPlanets; i++) {
    const points = curve.getPoints(CurveParams.numPoints);
    const index = Math.floor((i * points.length) / numPlanets);

    const star = new Star(points[index]);

    scene.add(star.createObject());
  }
}

function setObjects() {
  const galaxyCurve = new GalaxyCurve(CurveParams);

  curve = galaxyCurve.createObject();

  setStarsOnCurve();
}

function setLighting() {
  const ambientLight = new THREE.AmbientLight(0x404040);
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(50, 50, 50);

  scene.add(ambientLight);
  scene.add(pointLight);
}

function move() {
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
}

function animate() {
  move();
  renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(animate);
}

function main() {
  setLighting();
  setObjects();
  animate();
}

main();
