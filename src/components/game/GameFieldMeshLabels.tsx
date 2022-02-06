import React from 'react';
import { OFFSET_PIXEL_PRO_SECOND, PIXEL_PRO_SECOND } from '../../constants/properties';
import { IGame } from '../../models';
import { defaultCanvasProperties, Layers } from './Layers';

// TODO complete this function later
export function GameFieldMeshLabels(game: IGame, matrix: number[][]) {
  const gameFieldMeshLabelsRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = gameFieldMeshLabelsRef.current;
    defaultCanvasProperties(canvas, game.field.width, game.field.height, Layers.MESH_LABELS);
    const gameFieldMeshLabelsCtx = canvas.getContext('2d');
    drawMeshLabels(gameFieldMeshLabelsCtx, game, matrix);
  }, []);

  return gameFieldMeshLabelsRef;
}

function drawMeshLabels(ctx: CanvasRenderingContext2D, game: IGame, matrix: number[][]) {
  ctx.beginPath();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.font = '44px Arial';

  console.log('Matrix: ', matrix);

  const xAxisOffset = measureAxisOffset(game.store.x);
  const yAxisOffset = measureAxisOffset(game.store.y);

  for (let i = 0; i < matrix.length; i++) {
    const centerY = i * PIXEL_PRO_SECOND + yAxisOffset + OFFSET_PIXEL_PRO_SECOND;
    for (let j = 0; j < matrix[i].length; j++) {
      const centerX = j * PIXEL_PRO_SECOND + xAxisOffset + OFFSET_PIXEL_PRO_SECOND;
      if (matrix[i][j] === 0) {
        ctx.fillText('0', centerX - 10, centerY + 15);
      }
      if (matrix[i][j] === 1) {
        ctx.fillText('1', centerX - 10, centerY + 15);
      }
      if (matrix[i][j] === 2) {
        ctx.fillText('2', centerX - 10, centerY + 15);
      }
    }
  }
}

function measureAxisOffset(storeAxisPosition: number): number {
  const decimalOfDivision = (storeAxisPosition - OFFSET_PIXEL_PRO_SECOND) % PIXEL_PRO_SECOND;
  const restOfSubtraction = PIXEL_PRO_SECOND - decimalOfDivision;
  return -Math.abs(restOfSubtraction);
}
