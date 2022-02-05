import { OFFSET_PIXEL_PRO_SECOND, PIXEL_PRO_SECOND } from '../constants/properties';
import { IField } from './Field';
import { IOrder } from './Order';
import { IPoint } from './Point';

const SCOOTER_SPEED = 80;
const TIME_TO_PREPARATION = 1;

type IPath = 'North' | 'East' | 'South' | 'West';

export type IPathLocation = {
  path: IPath[];
  row: number;
  column: number;
};

interface ILocation {
  // 0 - not visited, 1 - start, 2 - end, 3 - visited, 4 - invalid, 5 - blocked
  row: number;
  column: number;
  path: IPath[];
  status: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface IGame {
  id: number;
  field: IField;
  store: IPoint;
  maxPizza: number;
  maxScooter: number;
  orders: IOrder[];
  getAmountOfOrders?(): number;
  calculateTimeToDelivery?(order: IOrder): number;
  getMatrix?(): number[][];
  getStoreRowPosition?(): number;
  getStoreColumnPosition?(): number;
  getOrdersSortedByDeliveryTime?(): IOrder[];
  // findShortestPath?(start: number[], end: number[], matrix: number[][]): IPathLocation;
  // calculateShortestPath?(): any;
  getSortedListOfPathsByShorterFirst?(): IPathLocation[];
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

    // console.log('Rows: ', this.__getRows());
    // console.log('Columns: ', this.__getColumns());
    // console.log('Shortest path: ', this.calculateShortestPath());
  }

  getOrdersSortedByDeliveryTime(): IOrder[] {
    return this.orders.sort((a, b) => {
      if (a.deliveryTime < b.deliveryTime) {
        return -1;
      }
      if (a.deliveryTime > b.deliveryTime) {
        return 1;
      }
      return 0;
    });
  }

  getAmountOfOrders(): number {
    let amountOfOrders = 0;
    for (let i = 0; i < this.orders.length; i++) {
      amountOfOrders += this.orders[i].amountOfOrders;
    }
    return amountOfOrders;
  }

  calculateTimeToDelivery(order: IOrder): number {
    return Math.round(Math.hypot(this.store.x - order.position.x, this.store.y - order.position.y) / SCOOTER_SPEED) + TIME_TO_PREPARATION;
  }

  getMatrix(): number[][] {
    const matrix = this.__getPlainMatrix();

    matrix[this.getStoreRowPosition()][this.getStoreColumnPosition()] = 1;

    for (let i = 0; i < this.orders.length; i++) {
      const orderRowPosition = this.__getOrderRowPosition(this.orders[i].position.y);
      const orderColumnPosition = this.__getOrderColumnPosition(this.orders[i].position.x);

      matrix[orderRowPosition][orderColumnPosition] = 2;
    }

    return matrix;
  }

  getStoreColumnPosition(): number {
    // Let's assume that the store is in the first column
    let storePosition = 0;

    // Each column has the value of x coordinate as an array [x1, x2] e.g start and end of the column
    const columns = this.__getColumns();

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (1 in column) {
        storePosition = i;
      }
    }

    return storePosition;
  }

  getStoreRowPosition(): number {
    // Let's assume that the store is in the first row
    let storePosition = 0;

    // Each row has the value of y coordinate as an array [y1, y2] e.g start and end of the row
    const rows = this.__getRows();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (1 in row) {
        storePosition = i;
      }
    }

    return storePosition;
  }

  getSortedListOfPathsByShorterFirst(): IPathLocation[] {
    const listOfAllPaths: IPathLocation[] = [];
    const matrix = this.getMatrix();
    const start = [this.getStoreRowPosition(), this.getStoreColumnPosition()];

    for (let i = 0; i < this.orders.length; i++) {
      const order = this.orders[i];
      const orderRowPosition = this.__getOrderRowPosition(order.position.y);
      const orderColumnPosition = this.__getOrderColumnPosition(order.position.x);

      const end = [orderRowPosition, orderColumnPosition];

      const path = this.findShortestPath(start, end, matrix);

      listOfAllPaths.push(path);
    }

    return listOfAllPaths.sort((a, b) => {
      if (a.path.length < b.path.length) {
        return -1;
      }
      if (a.path.length > b.path.length) {
        return 1;
      }
      return 0;
    });
  }

  findShortestPath(startingPosition: number[], goal: number[], matrix: number[][]): IPathLocation {
    const location: ILocation = {
      row: startingPosition[0],
      column: startingPosition[1],
      path: [],
      status: 0,
    };

    const queue = [location];

    while (queue.length > 0) {
      const currentLocation = queue.shift();

      let newLocation = this.__exploreInDirection(currentLocation, 'North', matrix);
      if (newLocation.status === 2 && newLocation.row === goal[0] && newLocation.column === goal[1]) {
        return {
          path: newLocation.path,
          row: newLocation.row,
          column: newLocation.column,
        };
      } else if (newLocation.status === 0) {
        queue.push(newLocation);
      }

      newLocation = this.__exploreInDirection(currentLocation, 'East', matrix);
      if (newLocation.status === 2 && newLocation.row === goal[0] && newLocation.column === goal[1]) {
        return {
          path: newLocation.path,
          row: newLocation.row,
          column: newLocation.column,
        };
      } else if (newLocation.status === 0) {
        queue.push(newLocation);
      }

      newLocation = this.__exploreInDirection(currentLocation, 'South', matrix);
      if (newLocation.status === 2 && newLocation.row === goal[0] && newLocation.column === goal[1]) {
        return {
          path: newLocation.path,
          row: newLocation.row,
          column: newLocation.column,
        };
      } else if (newLocation.status === 0) {
        queue.push(newLocation);
      }

      newLocation = this.__exploreInDirection(currentLocation, 'West', matrix);
      if (newLocation.status === 2 && newLocation.row === goal[0] && newLocation.column === goal[1]) {
        return {
          path: newLocation.path,
          row: newLocation.row,
          column: newLocation.column,
        };
      } else if (newLocation.status === 0) {
        queue.push(newLocation);
      }
    }
  }

  calculateShortestPath() {
    // NOTE: This is dummy function to check some theory
    const calculation: { orderPosition: number[]; deliveryTime: number; stepsNeeded: number; path: IPath[]; theoryCalc: number }[] = [];
    const start = [this.getStoreRowPosition(), this.getStoreColumnPosition()];

    for (let i = 0; i < this.orders.length; i++) {
      const order = this.orders[i];
      const row = this.__getOrderRowPosition(order.position.y);
      const column = this.__getOrderColumnPosition(order.position.x);
      const path = this.findShortestPath(start, [row, column], this.getMatrix());
      calculation.push({
        orderPosition: [row, column],
        deliveryTime: order.deliveryTime,
        stepsNeeded: path.path.length,
        path: path.path,
        theoryCalc: order.deliveryTime / path.path.length,
      });
    }

    console.log(calculation);
  }

  private __getOrderRowPosition(orderY: number): number {
    let orderPosition = 0;

    const rows = this.__getRows();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      for (let j = 0; j < Object.values(row).length; j++) {
        const value = Object.values(row)[j];
        if (orderY >= value[0] && orderY <= value[1]) {
          orderPosition = i;
        }
      }
    }

    return orderPosition;
  }

  private __getOrderColumnPosition(orderX: number): number {
    let orderPosition = 0;

    const columns = this.__getColumns();

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      for (let j = 0; j < Object.values(column).length; j++) {
        const value = Object.values(column)[j];
        if (value[0] <= orderX && value[1] >= orderX) {
          orderPosition = i;
        }
      }
    }

    return orderPosition;
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

  // Explores the grid from the given location in the given
  // direction
  private __exploreInDirection(currentLocation: ILocation, direction: IPath, matrix: number[][]): ILocation {
    const newPath = currentLocation.path.slice();
    newPath.push(direction);

    let row = currentLocation.row;
    let col = currentLocation.column;

    if (direction === 'North') {
      row -= 1;
    } else if (direction === 'East') {
      col += 1;
    } else if (direction === 'South') {
      row += 1;
    } else if (direction === 'West') {
      col -= 1;
    }

    const newLocation: ILocation = {
      row,
      column: col,
      path: newPath,
      status: 0,
    };

    newLocation.status = this.__locationStatus(newLocation, matrix);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 0) {
      matrix[newLocation.row][newLocation.column] = 3;
    }

    return newLocation;
  }

  private __locationStatus(location: ILocation, matrix: number[][]): 0 | 1 | 2 | 3 | 4 | 5 {
    if (location.row < 0 || location.row >= matrix.length) {
      return 4;
    }

    if (location.column < 0 || location.column >= matrix[0].length) {
      return 4;
    }

    if (matrix[location.row][location.column] === 2) {
      return 2;
    }

    if (matrix[location.row][location.column] === 1) {
      return 1;
    }

    if (matrix[location.row][location.column] === 5) {
      return 5;
    }

    return 0;
  }
}
