import { OFFSET_PIXEL_PRO_SECOND, PIXEL_PRO_SECOND } from '../constants/properties';
import { IField } from './Field';
import { IOrder } from './Order';
import { IPoint } from './Point';

const SCOOTER_SPEED = 80;
const TIME_TO_PREPARATION = 1;

export interface IGame {
  id: number;
  field: IField;
  store: IPoint;
  maxPizza: number;
  maxScooter: number;
  orders: IOrder[];
  getAmountOfScooters?(): number;
  calculateTimeToDelivery?(order: IOrder): number;
  getMatrix?(): number[][];
}

export class Game implements IGame {
  id: number;
  field: IField;
  store: IPoint;
  maxPizza: number;
  maxScooter: number;
  orders: IOrder[];

  constructor(id: number, field: IField, store: IPoint, maxPizza: number, maxScooter: number, orders: IOrder[]) {
    this.id = id;
    this.field = field;
    this.store = store;
    this.maxPizza = maxPizza;
    this.maxScooter = maxScooter;
    this.orders = orders;
  }
  getAmountOfScooters(): number {
    return this.orders.reduce((acc, cur) => acc + cur.amountOfOrders, 0);
  }
  calculateTimeToDelivery(order: IOrder): number {
    return Math.round(Math.hypot(this.store.x - order.position.x, this.store.y - order.position.y) / SCOOTER_SPEED) + TIME_TO_PREPARATION;
  }

  getMatrix(): number[][] {
    const matrix = this.__getPlainMatrix();

    matrix[this.__getStoreRowPosition()][this.__getStoreColumnPosition()] = 1;

    this.orders.forEach((order) => {
      const orderRowPosition = this.__getOrderRowPosition(order.position.y, matrix.length * PIXEL_PRO_SECOND);
      const orderColumnPosition = this.__getOrderColumnPosition(order.position.x, matrix[0].length * PIXEL_PRO_SECOND);

      matrix[orderRowPosition][orderColumnPosition] = 2;
    });

    return matrix;
  }

  private __getOrderRowPosition(orderY: number, height: number): number {
    let orderPosition = this.__getStoreRowPosition();

    if (orderY <= this.__getStoreRowPosition() * PIXEL_PRO_SECOND) {
      for (let i = this.__getStoreRowPosition() * PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
        if (orderY <= i && orderY >= i - PIXEL_PRO_SECOND) {
          return orderPosition;
        }
        orderPosition--;
      }
    } else {
      for (let i = this.__getStoreRowPosition() * PIXEL_PRO_SECOND; i < height; i += PIXEL_PRO_SECOND) {
        if (orderY >= i && orderY <= i + PIXEL_PRO_SECOND) {
          return orderPosition;
        }
        orderPosition++;
      }
    }

    return orderPosition;
  }

  private __getOrderColumnPosition(orderX: number, width: number): number {
    let orderPosition = this.__getStoreColumnPosition();

    if (orderX <= this.__getStoreColumnPosition() * PIXEL_PRO_SECOND) {
      for (let i = this.__getStoreColumnPosition() * PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
        if (orderX <= i && orderX >= i - PIXEL_PRO_SECOND) {
          return orderPosition;
        }
        orderPosition--;
      }
    } else {
      for (let i = this.__getStoreColumnPosition() * PIXEL_PRO_SECOND; i < width; i += PIXEL_PRO_SECOND) {
        if (orderX >= i && orderX <= i + PIXEL_PRO_SECOND) {
          return orderPosition;
        }
        orderPosition++;
      }
    }

    return orderPosition;
  }

  private __getStoreColumnPosition(): number {
    let storePosition = 0;
    if (this.store.x - OFFSET_PIXEL_PRO_SECOND < 0) {
      return storePosition;
    }

    for (let i = this.store.x - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
      if (i > 0 && i - PIXEL_PRO_SECOND < 0) {
        storePosition++;
        break;
      }

      storePosition++;
    }

    return storePosition;
  }

  private __getStoreRowPosition(): number {
    let storePosition = 0;
    if (this.store.y - OFFSET_PIXEL_PRO_SECOND < 0) {
      return storePosition;
    }

    for (let i = this.store.y - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
      if (i > 0 && i - PIXEL_PRO_SECOND < 0) {
        storePosition++;
        break;
      }

      storePosition++;
    }

    return storePosition;
  }

  private __getPlainMatrix(): number[][] {
    const matrix = [];

    for (let i = 0; i < this.__getRows().length; i++) {
      matrix.push([]);
      for (let j = 0; j < this.__getColumns().length; j++) {
        matrix[i].push(0);
      }
    }

    return matrix;
  }

  private __getRows(): any[] {
    const rows = [];
    for (let i = this.store.y + OFFSET_PIXEL_PRO_SECOND; i < this.field.height; i += PIXEL_PRO_SECOND) {
      if (i < this.field.height && i + PIXEL_PRO_SECOND > this.field.height) {
        rows.push([]);
        break;
      }

      rows.push([]);
    }

    for (let i = this.store.y - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
      if (i > 0 && i - PIXEL_PRO_SECOND < 0) {
        rows.push([]);
        break;
      }

      rows.push([]);
    }

    rows.push([]);
    return rows;
  }

  private __getColumns(): any[] {
    const columns = [];
    for (let i = this.store.x + OFFSET_PIXEL_PRO_SECOND; i < this.field.width; i += PIXEL_PRO_SECOND) {
      if (i < this.field.width && i + PIXEL_PRO_SECOND > this.field.width) {
        columns.push([]);
        break;
      }

      columns.push([]);
    }

    for (let i = this.store.x - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
      if (i > 0 && i - PIXEL_PRO_SECOND < 0) {
        columns.push([]);
        break;
      }

      columns.push([]);
    }

    columns.push([]);
    return columns;
  }
}
