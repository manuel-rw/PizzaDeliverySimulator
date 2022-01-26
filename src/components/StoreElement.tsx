import { useContext } from 'react';
import { StaticCanvasContext } from '../CanvasStatic';

export const StoreElement = (): null => {
  const staticCanvasContext = useContext(StaticCanvasContext);
  const { ctx, scale, offsetX, offsetY } = staticCanvasContext;
  if (ctx !== null) {
    ctx.beginPath();

    ctx.fillStyle = '#ff0000';
    ctx.arc(20 * scale + offsetX, 10 * scale + offsetY, 10, 0, 2 * Math.PI);
    ctx.fill();
  }

  return null;
};
