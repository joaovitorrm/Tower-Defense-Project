import Game from './game';
import InputManager from './InputManager';
import MapManager from './MapManager';
import { SETTINGS } from './Settings';
import './style.css'
import UiManager from './UiManager';

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = gameCanvas.getContext('2d') as CanvasRenderingContext2D;

if (context) {
  // Set canvas dimensions
  gameCanvas.width = SETTINGS.CANVAS_WIDTH;
  gameCanvas.height = SETTINGS.CANVAS_HEIGHT;

  const inputManager = new InputManager(gameCanvas);
  const mapManager = new MapManager();
  const uiManager = new UiManager();
  const game = new Game(inputManager, mapManager, uiManager);

  const gameLoop = () => {
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    game.draw(context);
    game.update(1 / 60);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}


