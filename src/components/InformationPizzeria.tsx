import React from 'react';
import { Game, IGame } from '../models';

export default function InformationPizzeria(g: IGame) {
  const game = new Game(g.id, g.field, g.store, g.maxPizza, g.maxScooter, g.orders);

  let canceledOrders = 0;
  const sortedOrders = game.getOrdersSortedByDeliveryTime();
  sortedOrders.forEach((order) => {
    if (order.deliveryTime <= 31) {
      canceledOrders++;
    }
  });

  return (
    <>
      <h3>Information Pizzeria</h3>
      <small>Max order capacity pro Client: {game.maxPizza}</small>
      <small>Scooter transport capacity: {game.maxScooter}</small>
      <small>Amount of Orders: {game.orders.length}</small>
      <small>Amount of canceled Orders: {canceledOrders}</small>
    </>
  );
}
