import React from 'react';
import { PIXEL_PRO_SECOND, OFFSET_PIXEL_PRO_SECOND } from '../../constants/properties';
import { IField, IGame, IPoint } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

export function GameFieldMesh(game: IGame) {
  const gameFieldMeshRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = gameFieldMeshRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.MESH);

    const gameFieldMeshCtx = canvas.getContext('2d');
    drawMesh(gameFieldMeshCtx, game.store, game.field);
  }, []);
  return gameFieldMeshRef;
}

function drawMesh(ctx: CanvasRenderingContext2D, pizzeria: IPoint, gameField: IField) {
  ctx.beginPath();

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (let i = pizzeria.x - OFFSET_PIXEL_PRO_SECOND; i < gameField.width; i += PIXEL_PRO_SECOND) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, gameField.height);
  }

  for (let i = pizzeria.x + OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, gameField.height);
  }

  for (let i = pizzeria.y + OFFSET_PIXEL_PRO_SECOND; i < gameField.height; i += PIXEL_PRO_SECOND) {
    ctx.moveTo(0, i);
    ctx.lineTo(gameField.width, i);
  }

  for (let i = pizzeria.y - OFFSET_PIXEL_PRO_SECOND; i > 0; i -= PIXEL_PRO_SECOND) {
    ctx.moveTo(0, i);
    ctx.lineTo(gameField.width, i);
  }

  ctx.stroke();
}
