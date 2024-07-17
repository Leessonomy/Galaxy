import { CurveConfig } from "./galaxy";

export function generateCurvePoints(
  i: number,
  noiseFn: (x: number, y: number, z: number) => number,
  params: CurveConfig
) {
  const { numPoints, radius, noiseScale, turns, distanceCoeff } = params;

  const angle = (i / numPoints) * turns * Math.PI * 2;
  const distance = radius * Math.pow(i / numPoints, distanceCoeff);
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  const z = (Math.random() - 0.5) * 20;

  const _x = x + noiseFn(x * noiseScale, y * noiseScale, z * noiseScale) * 20;
  const _y = y + noiseFn(y * noiseScale, z * noiseScale, x * noiseScale) * 20;
  const _z = z + noiseFn(z * noiseScale, x * noiseScale, y * noiseScale) * 10;

  return [_x, _y, _z];
}
