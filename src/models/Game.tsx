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

  // TODO: there is only one scooter. Fix this to count the amount of maximal scooter capacity
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
      const orderRowPosition = this.__getOrderRowPosition(order.position.y);
      const orderColumnPosition = this.__getOrderColumnPosition(order.position.x);

      matrix[orderRowPosition][orderColumnPosition] = 2;
    });

    return matrix;
  }

  private __getOrderRowPosition(orderY: number): number {
    let orderPosition = 0;

    const rows = this.__getRows();

    rows.forEach((row, index) => {
      Object.values(row).forEach((value) => {
        if (orderY >= value[0] && orderY <= value[1]) {
          orderPosition = index;
        }
      });
    });

    return orderPosition;
  }

  private __getOrderColumnPosition(orderX: number): number {
    let orderPosition = 0;

    const columns = this.__getColumns();

    columns.forEach((column, index) => {
      // for each key in the column
      Object.values(column).forEach((value) => {
        // if the value of the key is less or more than the order x coordinate
        if (value[0] <= orderX && value[1] >= orderX) {
          orderPosition = index;
        }
      });
    });

    return orderPosition;
  }

  private __getStoreColumnPosition(): number {
    // Let's assume that the store is in the first column
    let storePosition = 0;

    // Each column has the value of x coordinate as an array [x1, x2] e.g start and end of the column
    const columns = this.__getColumns();
    console.log('Columns: ', columns);

    columns.forEach((column, index) => {
      // Check the key of an object in the column
      // If it equals 1 (store), we return the column number
      if (1 in column) {
        storePosition = index;
      }
    });

    return storePosition;
  }

  private __getStoreRowPosition(): number {
    // Let's assume that the store is in the first row
    let storePosition = 0;

    // Each row has the value of y coordinate as an array [y1, y2] e.g start and end of the row
    const rows = this.__getRows();
    console.log('Rows: ', rows);

    rows.forEach((row, index) => {
      // Check the key of an object in the row
      // If it equals 1 (store), we return the row number
      if (1 in row) {
        storePosition = index;
      }
    });

    return storePosition;
  }

  private __getPlainMatrix(): number[][] {
    // This function creates a matrix of rows and columns without any values in the array
    // [[], [], [], ...]
    const matrix = [];

    for (let i = 0; i < this.__getRows().length; i++) {
      matrix.push([]);
      for (let j = 0; j < this.__getColumns().length; j++) {
        matrix[i].push(0);
      }
    }

    return matrix;
  }

  private __getRows(): ({ 1: number[] } | { 0: number[] })[] {
    // We count the rows always from the position of the store
    // Store should be always in the middle of the Node e.g row+column #
    const rows = [];

    // We add one row right before the counting starts
    // This row represents the row where the store is
    rows.push({ 1: [this.store.y - OFFSET_PIXEL_PRO_SECOND, this.store.y + OFFSET_PIXEL_PRO_SECOND] });

    // First count the rows from store to the bottom of the field
    // We add the offset e.g 40 Pixels
    for (let i = this.store.y + OFFSET_PIXEL_PRO_SECOND; i < this.field.height; i += PIXEL_PRO_SECOND) {
      rows.push({ 0: [i, i + PIXEL_PRO_SECOND] });
    }

    // Then count the rows from store to the top of the field
    for (let i = this.store.y - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
      // Prepend the row to the array
      rows.unshift({ 0: [i - PIXEL_PRO_SECOND, i] });
    }

    return rows;
  }

  private __getColumns(): ({ 1: number[] } | { 0: number[] })[] {
    // We count the columns always from the position of the store
    // Store should be always in the middle of the Node e.g column+row #
    const columns = [];

    // We add one column right before the counting starts
    // This column represents the column where the store is
    columns.push({ 1: [this.store.x - OFFSET_PIXEL_PRO_SECOND, this.store.x + OFFSET_PIXEL_PRO_SECOND] });

    // First count the columns from store to the right of the field
    for (let i = this.store.x + OFFSET_PIXEL_PRO_SECOND; i < this.field.width; i += PIXEL_PRO_SECOND) {
      columns.push({ 0: [i, i + PIXEL_PRO_SECOND] });
    }

    // Then count the columns from store to the left of the field
    for (let i = this.store.x - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
      // Prepend the column to the array
      columns.unshift({ 0: [i - PIXEL_PRO_SECOND, i] });
    }

    return columns;
  }
}
