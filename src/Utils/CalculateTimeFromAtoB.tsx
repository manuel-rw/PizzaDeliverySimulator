import { Point } from '../models';

const SCOOTER_SPEED = 80;

export default function CalculateTimeFromAtoB(a: Point, b: Point): number {
  return Math.round(Math.hypot(a.x - b.x, a.y - b.y) / SCOOTER_SPEED);
}
