import React from 'react';
import { OFFSET_PIXEL_PRO_SECOND, PIXEL_PRO_SECOND } from '../../constants/properties';
import { IGame } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

// TODO complete this function later
export function GameFieldMeshLabels(game: IGame) {
  const gameFieldMeshLabelsRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = gameFieldMeshLabelsRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.MESH_LABELS);
    const gameFieldMeshLabelsCtx = canvas.getContext('2d');
    drawMeshLabels(gameFieldMeshLabelsCtx, game);
  }, []);

  return gameFieldMeshLabelsRef;
}

function drawMeshLabels(ctx: CanvasRenderingContext2D, game: IGame) {
  ctx.beginPath();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.font = '12px Arial';

  const matrix = game.getMatrix();

  let yAxisOffset = 0;
  if (game.store.y % PIXEL_PRO_SECOND != 0) {
    // if store is not aligned with the grid
    let squares = (game.store.y - OFFSET_PIXEL_PRO_SECOND) / PIXEL_PRO_SECOND + 1; // how many squares are there from the store to the 0 position of y axis
    squares = parseInt((squares + '').split('.')[0]); // remove the decimal part
    yAxisOffset = squares * PIXEL_PRO_SECOND; // how many pixels are there from the store to the 0 position of y axis + offset
  } else {
    yAxisOffset = (game.store.y / PIXEL_PRO_SECOND) * PIXEL_PRO_SECOND;
  }
  let xAxisOffset = 0;
  if (game.store.x % PIXEL_PRO_SECOND != 0) {
    // if store is not aligned with the grid
    xAxisOffset = parseInt((game.store.x / PIXEL_PRO_SECOND + 1 + '').split('.')[0]) * PIXEL_PRO_SECOND;
  } else {
    xAxisOffset = (game.store.x / PIXEL_PRO_SECOND) * PIXEL_PRO_SECOND;
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const centerY =
        i * PIXEL_PRO_SECOND + (yAxisOffset - game.store.y + Math.abs(yAxisOffset - game.store.y - 70)) - OFFSET_PIXEL_PRO_SECOND;
      const centerX =
        j * PIXEL_PRO_SECOND + (xAxisOffset - game.store.x + Math.abs(xAxisOffset - game.store.x - 80)) - OFFSET_PIXEL_PRO_SECOND;

      if (matrix[i][j] === 0) {
        ctx.fillText('0', centerX, centerY);
      }
    }
  }
}
