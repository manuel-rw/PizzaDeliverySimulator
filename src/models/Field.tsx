export interface IField {
  width: number;
  height: number;
}

export class Field implements IField {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
