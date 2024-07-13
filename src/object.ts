// @ts-nocheck

import * as THREE from "three";
import ASSET from "../assets/star2.png";

const texture = new THREE.TextureLoader().load(ASSET);
const material = new THREE.SpriteMaterial({
  map: texture,
  color: "#FFFFFF",
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
