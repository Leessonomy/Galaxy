import * as THREE from "three";
import ASSET from "../assets/star2.png";

export class Star {
  private position: THREE.Vector3;

  constructor(position: THREE.Vector3) {
    this.position = position;
  }

  createObject() {
    const texture = new THREE.TextureLoader().load(ASSET);

    const material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(2, 2, 2);
    sprite.position.copy(this.position);

    return sprite;
  }
}
