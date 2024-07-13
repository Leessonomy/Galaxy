import { CurveConfig } from "./galaxy";

export function generateCurvePoints(
  i: number,
  noise: (x: number, y: number, z: number) => number,
  params: CurveConfig
) {
  const { numPoints, radius, noiseScale, turns } = params;

  const angle = (i / numPoints) * turns * Math.PI * 2;
  const distance = radius * Math.pow(i / numPoints, 0.5);
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  const z = (Math.random() - 0.5) * 20;

  const _x = x + noise(x * noiseScale, y * noiseScale, z * noiseScale) * 20;
  const _y = y + noise(y * noiseScale, z * noiseScale, x * noiseScale) * 20;
  const _z = z + noise(z * noiseScale, x * noiseScale, y * noiseScale) * 10;

  return [_x, _y, _z];
}
