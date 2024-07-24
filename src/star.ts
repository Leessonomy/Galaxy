import * as THREE from "three";
import TEXTURE from "../assets/star2.png";

interface StarConfig {
  position: THREE.Vector3;
  color: THREE.Color;
}

const texture = new THREE.TextureLoader().load(TEXTURE, (texture) => {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
});

const material = new THREE.SpriteMaterial({
  map: texture,
  transparent: true,
  opacity: 0.9,
  fog: true,
  blending: THREE.AdditiveBlending,
});

export class Star {
  readonly position: THREE.Vector3;
  readonly color: THREE.Color;

  constructor(config: StarConfig) {
    Object.assign(this, config);
  }

  createObject() {
    material.color = this.color.clone();
    const sprite = new THREE.Sprite(material);

    const scale = Math.random() * 12;
    sprite.scale.set(scale, scale, scale);
    sprite.position.copy(this.position);

    return sprite;
  }
}
