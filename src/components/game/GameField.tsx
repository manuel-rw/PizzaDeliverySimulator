import React from 'react';
import { defaultCanvasProperties, Layers } from './Layers';

export function GameField(width: number, height: number) {
  const gameFieldRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = gameFieldRef.current;
    defaultCanvasProperties(canvas, width, height, Layers.BACKGROUND);
    const gameFieldCtx = canvas.getContext('2d');
    gameFieldCtx.fillStyle = '#222';
    gameFieldCtx.fillRect(0, 0, width, height);
  }, []);

  return gameFieldRef;
}
