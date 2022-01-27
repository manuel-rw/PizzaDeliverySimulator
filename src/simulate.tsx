import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Canvas from './components/Canvas';
import { Game } from './models';

interface Order {
  id: number;
  gameId: number;
  deliveryTime: number;
  position: Point;
  amountOfOrders: number;
  type: string;
}

interface Point {
  x: number;
  y: number;
}
import InformationPizzeria from './components/InformationPizzeria';
import InformationDeliveries from './components/InformationDeliveries';

export default function Simulate() {
  const location = useLocation().state;
  const game = location as Game;
  const navigate = useNavigate();
  const isMounted = React.useRef(true);
  const [canvasRef, ctx, drawStore, drawDeliveryPoint, animateDelivery] = Canvas();

  // get current BrowserWindow
  const win = window as any;
  // resize the window to the size of the game field
  win.resizeTo(game.field.width + 600, game.field.height + 150);

  React.useEffect(() => {
    game.orders.forEach((order) => {
      drawDeliveryPoint(order.position);
    });

    drawStore(game.store.x, game.store.y);

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return (
    <>
      <div className="game-details-wrapper">
        <div style={{ paddingLeft: '20px', paddingTop: '20px' }}>
          <canvas
            id="field"
            width={game.field.width}
            height={game.field.height}
            style={{
              border: '1px solid black',
              backgroundColor: '#222',
            }}
            ref={canvasRef}
          />
          <div style={{ marginRight: 'auto', paddingTop: '5px' }}>
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
                for (let i = 0; i < game.orders.length; i++) {
                  animateDelivery(
                    { x: game.store.x, y: game.store.y },
                    { x: game.orders[i].position.x, y: game.orders[i].position.y },
                    canvasRef.current.getContext('2d'),
                  );
                }
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
