import React from 'react';
import { IGame, IPoint } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

export function DeliveryPoint(game: IGame) {
  const deliveryPointRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = deliveryPointRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.DELIVERY_POINT);
    const deliveryPointCtx = canvas.getContext('2d');
    game.orders.forEach((order) => {
      drawDeliveryPoint(deliveryPointCtx, order.position);
    });
  }, []);

  return deliveryPointRef;
}

function drawDeliveryPoint(ctx: CanvasRenderingContext2D, point: IPoint) {
  ctx.beginPath();

  ctx.fillStyle = '#00ff00';
  ctx.arc(point.x - 10, point.y - 10, 10, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();

  ctx.fillStyle = '#ff0000';
  ctx.arc(point.x - 10, point.y - 10, 1.5, 0, 2 * Math.PI);
  ctx.fill();
}
