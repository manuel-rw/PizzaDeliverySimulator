import React from 'react';
import { IGame, IPoint } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

export function DeliveryAnimation(game: IGame) {
  const deliveryAnimationRef = React.useRef(null);
  const animateDelivery = React.useCallback(() => {
    const canvas = deliveryAnimationRef.current;
    const deliveryAnimationCtx = canvas.getContext('2d');

    game.orders.forEach((order) => {
      forwardsAnimation(deliveryAnimationCtx, game.store, order.position);
    });
  }, [game]);

  React.useEffect(() => {
    const canvas = deliveryAnimationRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.DELIVERY_ANIMATION);
  }, []);

  return { deliveryAnimationRef, animateDelivery };
}

function forwardsAnimation(ctx: CanvasRenderingContext2D, store: IPoint, deliveryPoint: IPoint) {
  const xStepValue = (deliveryPoint.x - store.x) / 80;
  const yStepValue = (deliveryPoint.y - store.y) / 80;

  let xDelta = store.x;
  let yDelta = store.y;

  const interval = setInterval(() => {
    if (deliveryPoint.x > store.x) {
      if (xDelta <= deliveryPoint.x) {
        xStepValue > 0 ? (xDelta += xStepValue) : (xDelta -= Math.abs(xStepValue));
      }
    } else {
      if (xDelta >= deliveryPoint.x) {
        xStepValue > 0 ? (xDelta += xStepValue) : (xDelta -= Math.abs(xStepValue));
      }
    }
    if (deliveryPoint.y > store.y) {
      if (yDelta <= deliveryPoint.y) {
        yStepValue > 0 ? (yDelta += yStepValue) : (yDelta -= Math.abs(yStepValue));
      }
    } else {
      if (yDelta >= deliveryPoint.y) {
        yStepValue > 0 ? (yDelta += yStepValue) : (yDelta -= Math.abs(yStepValue));
      }
    }

    if (deliveryPoint.x > store.x && deliveryPoint.y > store.y) {
      if (xDelta >= deliveryPoint.x && yDelta >= deliveryPoint.y) {
        backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    } else if (deliveryPoint.x > store.x && deliveryPoint.y < store.y) {
      if (xDelta >= deliveryPoint.x && yDelta <= deliveryPoint.y) {
        backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    } else if (deliveryPoint.x < store.x && deliveryPoint.y > store.y) {
      if (xDelta <= deliveryPoint.x && yDelta >= deliveryPoint.y) {
        backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    } else if (deliveryPoint.x < store.x && deliveryPoint.y < store.y) {
      if (xDelta <= deliveryPoint.x && yDelta <= deliveryPoint.y) {
        backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    }

    _moveScooter(ctx, xDelta, yDelta);
  }, 100);
}

function backwardsAnimation(ctx: CanvasRenderingContext2D, deliveryPoint: IPoint, store: IPoint) {
  const xStepValue = (deliveryPoint.x - store.x) / 80;
  const yStepValue = (deliveryPoint.y - store.y) / 80;

  let xDelta = store.x;
  let yDelta = store.y;

  const interval = setInterval(() => {
    if (deliveryPoint.x > store.x) {
      if (xDelta <= deliveryPoint.x) {
        xStepValue > 0 ? (xDelta += xStepValue) : (xDelta -= Math.abs(xStepValue));
      }
    } else {
      if (xDelta >= deliveryPoint.x) {
        xStepValue > 0 ? (xDelta += xStepValue) : (xDelta -= Math.abs(xStepValue));
      }
    }
    if (deliveryPoint.y > store.y) {
      if (yDelta <= deliveryPoint.y) {
        yStepValue > 0 ? (yDelta += yStepValue) : (yDelta -= Math.abs(yStepValue));
      }
    } else {
      if (yDelta >= deliveryPoint.y) {
        yStepValue > 0 ? (yDelta += yStepValue) : (yDelta -= Math.abs(yStepValue));
      }
    }

    if (deliveryPoint.x > store.x && deliveryPoint.y > store.y) {
      if (xDelta >= deliveryPoint.x && yDelta >= deliveryPoint.y) {
        clearInterval(interval);
      }
    } else if (deliveryPoint.x > store.x && deliveryPoint.y < store.y) {
      if (xDelta >= deliveryPoint.x && yDelta <= deliveryPoint.y) {
        clearInterval(interval);
      }
    } else if (deliveryPoint.x < store.x && deliveryPoint.y > store.y) {
      if (xDelta <= deliveryPoint.x && yDelta >= deliveryPoint.y) {
        clearInterval(interval);
      }
    } else if (deliveryPoint.x < store.x && deliveryPoint.y < store.y) {
      if (xDelta <= deliveryPoint.x && yDelta <= deliveryPoint.y) {
        clearInterval(interval);
      }
    }

    _moveScooterBackwards(ctx, xDelta, yDelta);
  }, 100);
}

function _moveScooter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();

  ctx.fillStyle = '#0000ff';
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
}

function _moveScooterBackwards(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();

  // clip the arc and clear given position
  ctx.clearRect(x - 12, y - 12, 24, 24);
}
