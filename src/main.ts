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
  pointLight.position.set(50, 50, 50);
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

  const point = curve.getPointAt(time);
  const nextPoint = curve.getPointAt(Math.max(time - speed * delta, 0));

  camera.position.copy(point);
  camera.lookAt(nextPoint);

  const matrix = new THREE.Matrix4();
  const up = new THREE.Vector3(0, 0, 1);
  matrix.lookAt(camera.position, nextPoint, up);
  camera.rotation.setFromRotationMatrix(matrix);
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
