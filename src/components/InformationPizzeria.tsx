import React from 'react';
import { Game, IGame } from '../models';

//export default function InformationPizzeria(props : { game: IGame }) {
export default function InformationPizzeria({game} : { game: IGame }) {
  //const game = props.game;
  
  //const { game } = props;
  
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
