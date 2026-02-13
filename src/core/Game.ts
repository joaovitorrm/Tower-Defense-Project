import type InputManager from "./InputManager";
import type MapManager from "./MapManager";
import type UiManager from "./UiManager";
import type EnemyManager from "./EnemyManager";
import type TurretManager from "./TurretManager";


export default class Game {
    constructor(
        public mapManager: MapManager,
        public enemyManager: EnemyManager,
        public turretManager: TurretManager,
        public uiManager: UiManager
    ) {}

    update(delta: number, input: InputManager) : void {
        this.uiManager.update();
        this.enemyManager.update(delta);
        this.turretManager.update(delta, input, this.enemyManager);
    }

    draw(ctx: CanvasRenderingContext2D) : void {
        this.mapManager.draw(ctx);
        this.enemyManager.draw(ctx);
        this.turretManager.draw(ctx);
        this.uiManager.draw(ctx);
    }
}


/* export default class Game {

    public inputManager: InputManager;
    public screenManager: ScreenManager;
    public mapManager: MapManager = new MapManager();
    public uiManager: UiManager;
    public enemyManager: EnemyManager;
    public turretManager: TurretManager;    
    public player: Player = new Player(100, 10);

    constructor(canvas: HTMLCanvasElement) {

        this.inputManager = new InputManager(canvas);

        this.screenManager = new ScreenManager();

        this.mapManager.setMap(0);

        this.enemyManager = new EnemyManager(this.mapManager);        

        this.turretManager = new TurretManager();

        this.uiManager = new UiManager(this.inputManager, this.player, this.turretManager, this.mapManager);
    }

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.clearRect(0, 0, SETTINGS.CANVAS_WIDTH, SETTINGS.CANVAS_HEIGHT);

        this.mapManager.draw(ctx);

        this.turretManager.draw(ctx);

        this.enemyManager.draw(ctx);

        this.uiManager.draw(ctx);
    }

    update(deltaTime: number): void {

        this.uiManager.update();

        this.enemyManager.update(deltaTime);

        this.turretManager.update(deltaTime, this.inputManager, this.enemyManager);
    }
} */