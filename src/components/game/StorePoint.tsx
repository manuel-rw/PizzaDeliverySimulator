import React from 'react';
import { IGame, IPoint } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

export function StorePoint(game: IGame) {
  const storePointRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = storePointRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.STORE_POINT);
    const storePointCtx = canvas.getContext('2d');
    drawStore(storePointCtx, game.store);
  }, []);

  return storePointRef;
}

function drawStore(ctx: CanvasRenderingContext2D, point: IPoint) {
  // draw store
  ctx.beginPath();

  ctx.fillStyle = '#ff0000';
  ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
  ctx.fill();
}
