import * as THREE from "three";
import ASSET from "../assets/star2.png";

interface StarConfig {
  position: THREE.Vector3;
  color: number;
}

export class Star {
  readonly position: THREE.Vector3;
  readonly color: number;

  constructor(config: StarConfig) {
    Object.assign(this, config);
  }

  createObject() {
    const texture = new THREE.TextureLoader().load(ASSET);

    const material = new THREE.SpriteMaterial({
      map: texture,
      color: this.color,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const sprite = new THREE.Sprite(material);

    const scale = 1.1 + Math.random() * 3.9;
    sprite.scale.set(scale, scale, scale);
    sprite.position.copy(this.position);

    return sprite;
  }
}
