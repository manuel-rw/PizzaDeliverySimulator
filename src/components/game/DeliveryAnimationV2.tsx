import React from 'react';
import { IGame, IPathLocation } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

export function DeliveryAnimationV2(game: IGame) {
  const deliveryAnimationRef = React.useRef(null);
  const matrix = game.getMatrix();
  const startingPosition = [game.getStoreRowPosition(), game.getStoreColumnPosition()];
  const sortedPaths = game.getSortedListOfPathsByShorterFirst(matrix);

  const animateDelivery = React.useCallback(() => {
    const canvas = deliveryAnimationRef.current;
    const deliveryAnimationCtx = canvas.getContext('2d');
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.DELIVERY_ANIMATION);

    startAnimation(deliveryAnimationCtx, startingPosition, sortedPaths, game);
  }, [game]);

  return { deliveryAnimationRef, animateDelivery };
}

function startAnimation(ctx: CanvasRenderingContext2D, startingPosition: number[], sortedPaths: IPathLocation[], game: IGame) {
  const fromPosition = game.store;

  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
  ctx.moveTo(fromPosition.x, fromPosition.y);
  ctx.rect(fromPosition.x - 20, fromPosition.y - 20, 40, 40);
  ctx.fill();

  const prepareFullPath: { x: any; y: any }[] = [];
  prepareFullPath.push(game.store);

  sortedPaths.forEach((p) => {
    let counter = 0;
    p.path.forEach((direction) => {
      if (direction === 'North') {
        prepareFullPath.push({ x: prepareFullPath[prepareFullPath.length - 1].x, y: prepareFullPath[prepareFullPath.length - 1].y - 80 });
        if (counter === p.path.length - 1) {
          prepareFullPath.push(game.store);
        }
      } else if (direction === 'South') {
        prepareFullPath.push({ x: prepareFullPath[prepareFullPath.length - 1].x, y: prepareFullPath[prepareFullPath.length - 1].y + 80 });
        if (counter === p.path.length - 1) {
          prepareFullPath.push(game.store);
        }
      } else if (direction === 'East') {
        prepareFullPath.push({ x: prepareFullPath[prepareFullPath.length - 1].x + 80, y: prepareFullPath[prepareFullPath.length - 1].y });
        if (counter === p.path.length - 1) {
          prepareFullPath.push(game.store);
        }
      } else if (direction === 'West') {
        prepareFullPath.push({ x: prepareFullPath[prepareFullPath.length - 1].x - 80, y: prepareFullPath[prepareFullPath.length - 1].y });
        if (counter === p.path.length - 1) {
          prepareFullPath.push(game.store);
        }
      }
      counter++;
    });
  });

  let nextRect = 0;
  const si = setInterval(() => {
    ctx.clearRect(0, 0, game.field.width, game.field.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
    ctx.moveTo(prepareFullPath[nextRect].x, prepareFullPath[nextRect].y);

    if (nextRect < prepareFullPath.length - 1) {
      ctx.rect(prepareFullPath[nextRect].x - 20, prepareFullPath[nextRect].y - 20, 40, 40);
      ctx.fill();
      nextRect++;
    } else {
      clearInterval(si);
    }
  }, 800);
}
