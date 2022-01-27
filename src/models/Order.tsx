import { IPoint } from './Point';

export interface IOrder {
  id: number;
  gameId: number;
  deliveryTime: number;
  position: IPoint;
  amountOfOrders: number;
  type: string;
}

export class Order implements IOrder {
  id: number;
  gameId: number;
  deliveryTime: number;
  position: IPoint;
  amountOfOrders: number;
  type: string;

  constructor(id: number, gameId: number, deliveryTime: number, position: IPoint, amountOfOrders: number, type: string) {
    this.id = id;
    this.gameId = gameId;
    this.deliveryTime = deliveryTime;
    this.position = position;
    this.amountOfOrders = amountOfOrders;
    this.type = type;
  }
}
