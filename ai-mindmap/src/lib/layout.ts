export type Point = { x: number; y: number };

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleRadians: number
): Point {
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians),
  };
}

export function computeClusterAnchors(
  count: number,
  centerX: number,
  centerY: number,
  radius: number,
  startAngleRadians = -Math.PI / 2
): Array<{ point: Point; angle: number }> {
  const anchors: Array<{ point: Point; angle: number }> = [];
  for (let i = 0; i < count; i += 1) {
    const angle = startAngleRadians + (i * 2 * Math.PI) / count;
    anchors.push({ point: polarToCartesian(centerX, centerY, radius, angle), angle });
  }
  return anchors;
}

export function computeOrbitPositions(
  count: number,
  centerX: number,
  centerY: number,
  radius: number,
  startAngleRadians = -Math.PI / 2
): Array<{ point: Point; angle: number }> {
  const positions: Array<{ point: Point; angle: number }> = [];
  for (let i = 0; i < count; i += 1) {
    const angle = startAngleRadians + (i * 2 * Math.PI) / count;
    positions.push({ point: polarToCartesian(centerX, centerY, radius, angle), angle });
  }
  return positions;
}
