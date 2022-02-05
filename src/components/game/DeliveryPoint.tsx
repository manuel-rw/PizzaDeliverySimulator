import React from 'react';
import { IGame, IPoint } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

export function DeliveryPoint(game: IGame) {
  const deliveryPointRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = deliveryPointRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.DELIVERY_POINT);
    const deliveryPointCtx = canvas.getContext('2d');
    for (let i = 0; i < game.orders.length; i++) {
      drawDeliveryPoint(deliveryPointCtx, game.orders[i].position);
    }
  }, []);

  return deliveryPointRef;
}

function drawDeliveryPoint(ctx: CanvasRenderingContext2D, point: IPoint) {
  ctx.beginPath();

  ctx.fillStyle = '#00ff00';
  ctx.rect(point.x - 8, point.y - 8, 16, 16);
  ctx.fill();

  ctx.beginPath();

  ctx.fillStyle = '#ff0000';
  ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
  ctx.fill();
}
