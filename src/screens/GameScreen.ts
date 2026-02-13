import EnemyManager from "../core/EnemyManager";
import Game from "../core/Game";
import type { GameContext } from "../core/GameContext";
import MapManager from "../core/MapManager";
import { Screen } from "../core/Screen";
import TurretManager from "../core/TurretManager";
import UiManager from "../core/UiManager";

export class GameScreen extends Screen {

    private game: Game;

    constructor(private context: GameContext, private level: number) {
        super()

        const mapManager = new MapManager();
        mapManager.setMap(this.level);

        const enemyManager = new EnemyManager(mapManager);
        const turretManager = new TurretManager();
        const uiManager = new UiManager(
            this.context.input,
            this.context.player,
            turretManager,
            mapManager
        );

        this.game = new Game(
            mapManager,
            enemyManager,
            turretManager,
            uiManager
        );
    }

    update(delta: number): void {
        this.game.update(delta, this.context.input);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.game.draw(ctx);
    }

    onEnter(): void {
        
    }

    onExit(): void {
        
    }
}
