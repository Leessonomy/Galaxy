import * as THREE from "three";
import { generateCurvePoints } from "./helpers";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

export interface CurveConfig {
  numPoints: number;
  turns: number;
  radius: number;
  noiseScale: number;
  distanceCoeff: number;
}

export class GalaxyCurve {
  readonly numPoints: number;
  readonly turns: number;
  readonly radius: number;
  readonly noiseScale: number;
  readonly distanceCoeff: number;

  constructor(config: CurveConfig) {
    Object.assign(this, config);
  }

  createObject() {
    const noise = new ImprovedNoise();

    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= this.numPoints; i++) {
      const vec = new THREE.Vector3(
        ...generateCurvePoints(
          i,
          noise.noise.bind(noise),
          Object.assign({}, this)
        )
      );
      points.push(vec);
    }
    return new THREE.CatmullRomCurve3(points);
  }
}
