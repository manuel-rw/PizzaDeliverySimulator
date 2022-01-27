import React from 'react';
import { Game, IGame } from '../models';

export default function InformationDeliveries(g: IGame) {
  const game = new Game(g.id, g.field, g.store, g.maxPizza, g.maxScooter, g.orders);
  return (
    <>
      <h3>Information Deliveries</h3>
      {game.orders.map((order, index) => (
        <div key={order.id}>
          <small>
            <strong>Delivery {index + 1}</strong>
          </small>{' '}
          <br />
          <small>
            Amount of Pizza orders: <strong>{order.amountOfOrders}</strong>
          </small>{' '}
          <br />
          <small>
            Type of ordered Pizza: <strong>{order.type}</strong>
          </small>{' '}
          <br />
          <small>
            Desired delivery time: <strong>{order.deliveryTime}</strong>
          </small>{' '}
          <br />
          <small>
            Expected delivery time: <strong>{game.calculateTimeToDelivery(order)}min</strong>
          </small>
        </div>
      ))}
    </>
  );
}
