import * as React from 'react';
import { Button } from '@mui/material';
import { Game } from './models';
import InformationPizzeria from './components/InformationPizzeria';
import InformationDeliveries from './components/InformationDeliveries';
import { GameField, GameFieldMesh, StorePoint, DeliveryPoint, DeliveryAnimationV2, GameFieldMeshLabels } from './components/game';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Simulate() {
  const location: any = useLocation().state;
  const game = new Game(location.id, location.field, location.store, location.maxPizza, location.maxScooter, location.orders);
  const navigate = useNavigate();
  const gameFieldReference = GameField(game.field.width, game.field.height);

  const matrix = game.getMatrix();

  const gameFieldMeshRef = GameFieldMesh(game);
  const gameFieldMeshLabelsRef = GameFieldMeshLabels(game, matrix);
  const storePointRef = StorePoint(game);
  const deliveryPointRef = DeliveryPoint(game);
  const { deliveryAnimationRef, animateDelivery } = DeliveryAnimationV2(game);

  // get current BrowserWindow
  const win = window as any;
  // resize the window to the size of the game field
  win.resizeTo(game.field.width + 300, game.field.height + 150);

  return (
    <>
      <div className="game-details-wrapper">
        <div style={{ paddingLeft: '20px', paddingTop: '20px', display: 'flex', height: game.field.height + 60 }}>
          <div className="game-layers">
            <canvas ref={gameFieldReference}></canvas>
            <canvas ref={gameFieldMeshRef}></canvas>
            <canvas ref={storePointRef}></canvas>
            <canvas ref={deliveryPointRef}></canvas>
            <canvas ref={deliveryAnimationRef}></canvas>
            <canvas ref={gameFieldMeshLabelsRef}></canvas>
          </div>
          <div style={{ marginRight: 'auto', marginTop: 'auto', paddingTop: '5px' }}>
            <Button
              variant="outlined"
              onClick={() => {
                navigate('/main_window');
              }}>
              Back
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                animateDelivery();
              }}>
              Animate
            </Button>
          </div>
        </div>
        <div className="game-info-wrapper">
          <InformationPizzeria {...game} />
          <InformationDeliveries {...game} />
        </div>
      </div>
    </>
  );
}
