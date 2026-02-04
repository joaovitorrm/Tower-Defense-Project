import Game from './core/game';
import { SETTINGS } from '../data/configs/Settings';
import './style.css'

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = gameCanvas.getContext('2d') as CanvasRenderingContext2D;

if (context) {

  // Set canvas dimensions
  gameCanvas.width = SETTINGS.CANVAS_WIDTH;
  gameCanvas.height = SETTINGS.CANVAS_HEIGHT;

  const game = new Game(gameCanvas);

  let lastTime = performance.now();

  const gameLoop = () => {

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds and cap at 0.1s
    lastTime = currentTime;

    if (deltaTime > 0.1) {
      requestAnimationFrame(gameLoop);
      return;
    }

    game.draw(context);
    game.update(deltaTime);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}


