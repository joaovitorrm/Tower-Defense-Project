import Game from './game';
import InputManager from './InputManager';
import MapManager from './MapManager';
import './style.css'

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = gameCanvas.getContext('2d') as CanvasRenderingContext2D;

if (context) {
  // Set canvas dimensions
  gameCanvas.width = 800;
  gameCanvas.height = 600;

  const inputManager = new InputManager(gameCanvas);
  const mapManager = new MapManager();
  const game = new Game(inputManager, mapManager);

  const gameLoop = () => {
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    game.draw(context);
    game.update(1 / 60);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}


