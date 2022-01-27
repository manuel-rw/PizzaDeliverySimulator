import React from 'react';
import { Game } from '../models';

export default function InformationPizzeria(game: Game) {
  return (
    <>
      <h3>Information Pizzeria</h3>
      <small>Max order capacity pro Client: {game.maxPizza}</small>
      <small> Scooter transport capacity: {game.maxScooter}</small>
      <small> Amount of Orders: {game.orders.length}</small>
    </>
  );
}
