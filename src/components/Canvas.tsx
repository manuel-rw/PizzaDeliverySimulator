import React from 'react';
import { Point } from '../models';

const OFFSET = 5;

function _drawStore(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // draw store
  ctx.beginPath();

  ctx.fillStyle = '#ff0000';
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function _drawDeliveryPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // draw delivery point
  ctx.beginPath();

  ctx.fillStyle = '#00ff00';
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function _moveScooter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();

  ctx.fillStyle = '#0000ff';
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
}

function _moveScooterBackwards(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();

  ctx.fillStyle = '#222';
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fill();
}

function _backwardsAnimation(ctx: CanvasRenderingContext2D, deliveryPoint: { x: number; y: number }, store: { x: number; y: number }) {
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

function _animateDelivery(ctx: CanvasRenderingContext2D, store: { x: number; y: number }, deliveryPoint: { x: number; y: number }) {
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
        _backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    } else if (deliveryPoint.x > store.x && deliveryPoint.y < store.y) {
      if (xDelta >= deliveryPoint.x && yDelta <= deliveryPoint.y) {
        _backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    } else if (deliveryPoint.x < store.x && deliveryPoint.y > store.y) {
      if (xDelta <= deliveryPoint.x && yDelta >= deliveryPoint.y) {
        _backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    } else if (deliveryPoint.x < store.x && deliveryPoint.y < store.y) {
      if (xDelta <= deliveryPoint.x && yDelta <= deliveryPoint.y) {
        _backwardsAnimation(ctx, store, deliveryPoint);
        clearInterval(interval);
      }
    }

    _moveScooter(ctx, xDelta, yDelta);
  }, 100);
}

export default function Canvas() {
  const canvasRef = React.useRef(null);
  let ctx: any = null;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);

  function drawStore(x: number, y: number) {
    _drawStore(ctx, x, y);
  }

  function drawDeliveryPoint(point: Point) {
    _drawDeliveryPoint(ctx, point.x, point.y);
  }

  function animateDelivery(store: { x: number; y: number }, deliveryPoint: { x: number; y: number }, context: CanvasRenderingContext2D) {
    _animateDelivery(context, store, deliveryPoint);
  }

  return [canvasRef, ctx, drawStore, drawDeliveryPoint, animateDelivery];
}
