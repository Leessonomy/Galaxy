import * as THREE from "three";

import { GalaxyCurve } from "./galaxy";
import { Star } from "./star";
import { CurveParams } from "./global.config";

import {
  scene,
  camera,
  renderer,
  controls,
  composer,
  bloomEffect,
  renderEffect,
  shaderEffect,
} from "./setup";

let curve: THREE.CatmullRomCurve3;

const clock = new THREE.Clock();
let time = 1;
let speed = 0.001;

function setStarsOnCurve() {
  const starsGroup = new THREE.Group();
  const numPlanets = Math.floor(curve.getLength() / 2);

  for (let i = 0; i < numPlanets; i++) {
    const points = curve.getPoints(CurveParams.numPoints);
    const index = Math.floor((i * points.length) / numPlanets);

    const star = new Star({
      position: points[index],
      color: new THREE.Color(0xffffff),
    });

    starsGroup.add(star.createObject());
  }

  scene.add(starsGroup);
}

function setObjects() {
  const galaxyCurve = new GalaxyCurve(CurveParams);

  curve = galaxyCurve.createObject();

  setStarsOnCurve();
}

function setLighting() {
  const ambientLight = new THREE.AmbientLight(0x404040);
  const pointLight = new THREE.PointLight(0xffffff, 2, 500);
  pointLight.position.set(0, 0, 50);
  pointLight.color.setHSL(0.0, 0.0, 0.75);

  scene.add(ambientLight);
  scene.add(pointLight);
}

function setPostProcessing() {
  composer.addPass(renderEffect);
  composer.addPass(bloomEffect);
  composer.addPass(shaderEffect);
}

function move() {
  const delta = clock.getDelta();
  time -= speed * delta;

  if (time < 0) {
    time = 0;
  }

  const points = curve.getPoints(50);
  const len = points.length - 1;

  const index = Math.floor(time * len);
  const nextIndex = Math.min(index + 1, len);
  const alpha = time * len - index;

  const point0 = points[index];
  const point1 = points[nextIndex];

  // interpolation
  const x = point0.x + alpha * (point1.x - point0.x);
  const y = point0.y + alpha * (point1.y - point0.y);
  const z = point0.z + alpha * (point1.z - point0.z);

  const point = new THREE.Vector3(x, y, z);

  const nextAlpha = Math.min(time - speed * delta, 0);

  const nextPoint = new THREE.Vector3().lerpVectors(
    points[index],
    points[nextIndex],
    nextAlpha
  );

  camera.position.copy(point);
  camera.lookAt(nextPoint);
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
  setPostProcessing();
  animate();
}

main();
