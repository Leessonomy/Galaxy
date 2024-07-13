// @ts-nocheck

import * as THREE from "three";

const texture = new THREE.TextureLoader().load([]);
const material = new THREE.SpriteMaterial({
  map: texture,
  color: "#000000",
  transparent: true,
});

export class Star {
  constructor(position) {
    this.position = position;
    this.obj = null;
  }

  add(scene) {
    let sprite = new THREE.Sprite(material);

    sprite.scale.set(2, 2, 2);
    sprite.position.copy(this.position);

    this.obj = sprite;

    scene.add(sprite);
  }
}
