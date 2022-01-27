export interface IPoint {
  x: number;
  y: number;
}

export class Point implements IPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
