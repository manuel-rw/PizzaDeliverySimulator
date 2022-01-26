import React from 'react';
import CalculateTimeFromAtoB from '../Utils/CalculateTimeFromAtoB';
import { Game } from '../models';

export default function DeliveryTimeCalculation(props: any) {
  const [time, setTime] = React.useState(0);
  const orderId = props.orderId;
  const game = props.game as Game;
  React.useEffect(() => {
    const order = game.orders.find((o) => o.id === orderId);
    if (order) {
      const t = CalculateTimeFromAtoB(game.store, order.position);
      setTime(t);
    }
  }, []);

  return <>{time}</>;
}
