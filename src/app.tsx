import { Card, CardActions, CardContent, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { Game } from './models';
import Simulate from './simulate';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  // get current BrowserWindow
  const win = window as any;
  // resize the window to the size of the game field
  win.resizeTo(960, 830);

  const [games, setGames] = React.useState<Game[]>([]);

  React.useEffect(() => {
    fetch('https://lesta.iet-gibb.ch/pizza/api/Spiel', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data: any) => {
        const g: Game[] = [];
        const maxGames = data.length > 9 ? 9 : data.length;
        for (let i = 0; i < maxGames; i++) {
          g.push({
            id: data[i].id,
            field: { width: data[i].spielfeldX, height: data[i].spielfeldY },
            store: { x: data[i].zentraleX, y: data[i].zentraleY },
            maxPizza: data[i].maxPizza,
            maxScooter: data[i].maxScooter,
            orders: [],
          });
        }
        setGames(g);
        getAndAssignGameOrders(g);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }, []);

  return (
    <>
      <div className="games-list-wrapper">
        {isLoading && <GameListLoadingSkeleton />}
        {!isLoading &&
          games.map((game) => (
            <Card key={game.id} elevation={3}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Game {game.id}
                </Typography>
                {game.orders.length > 0 && (
                  <Typography variant="h5" component="div">
                    Amount of Scooters: {game.orders.reduce((acc, cur) => acc + cur.amountOfOrders, 0)}
                  </Typography>
                )}
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Amount of deliveries: {game.maxPizza}
                </Typography>
                <Typography variant="body2">
                  Game width: {game.field.width}
                  <br />
                  Game height: {game.field.height}
                  <br />
                  Position of Store: x{game.store.x} / y{game.store.y}
                </Typography>
              </CardContent>
              <CardActions>
                <Link className="button-link-primary" to={`/simulate`} state={{ ...game }}>
                  Play game {game.id}
                </Link>
              </CardActions>
            </Card>
          ))}
      </div>
    </>
  );
}

function getAndAssignGameOrders(gameList: Game[]) {
  gameList.forEach((game) => {
    fetch(`https://lesta.iet-gibb.ch/pizza/api/Spiel/${game.id}/bestellung`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((orderData: any) => {
        game.orders = orderData.map((order: any) => ({
          id: order.id,
          gameId: order.spielId,
          deliveryTime: order.zeitpunkt,
          position: { x: order.positionX, y: order.positionY },
          amountOfOrders: order.anzahl,
          type: order.typ,
        }));
      });
  });
}

function render() {
  ReactDOM.render(
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/main_window" element={<App />} />
        <Route path="/simulate" element={<Simulate />} />
      </Routes>
    </HashRouter>,
    document.getElementById('root'),
  );
}

render();
