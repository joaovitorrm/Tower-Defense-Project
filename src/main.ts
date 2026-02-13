import { SETTINGS } from '../data/configs/Settings';
import type { GameContext } from './core/GameContext';
import InputManager from './core/InputManager';
import ScreenManager from './core/ScreenManager';
import Player from './entities/Player';
import './style.css'

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const canvasCtx = gameCanvas.getContext('2d') as CanvasRenderingContext2D;

if (canvasCtx) {

  // Set canvas dimensions
  gameCanvas.width = SETTINGS.CANVAS_WIDTH;
  gameCanvas.height = SETTINGS.CANVAS_HEIGHT;

  const input = new InputManager(gameCanvas);
  const player = new Player(0, 10);

  const context = {} as GameContext;

  const screenManager = new ScreenManager(context);

  Object.assign(context, {
    input,
    player,
    screenManager
  })

  screenManager.changeScreen("menu");

  let lastTime = performance.now();

  const gameLoop = () => {

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds and cap at 0.1s
    lastTime = currentTime;

    if (deltaTime > 0.1) {
      requestAnimationFrame(gameLoop);
      return;
    }

    screenManager.update(deltaTime);
    screenManager.draw(canvasCtx);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}


