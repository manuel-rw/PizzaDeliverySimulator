import { Point } from './Point';

export interface Order {
  id: number;
  gameId: number;
  deliveryTime: number;
  position: Point;
  amountOfOrders: number;
  type: string;
}
