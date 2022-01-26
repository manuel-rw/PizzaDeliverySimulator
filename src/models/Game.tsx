import { Field } from './Field';
import { Order } from './Order';
import { Point } from './Point';

export interface Game {
  id: number;
  field: Field;
  store: Point;
  maxPizza: number;
  maxScooter: number;
  orders: Order[];
}
