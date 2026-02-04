import InputManager from "./InputManager";
import MapManager from "./MapManager";
import { SETTINGS } from "../../data/configs/Settings";
import UiManager from "./UiManager";
import EnemyManager from "./EnemyManager";
import Player from "../entities/Player";
import TurretManager from "./TurretManager";

export default class Game {

    public inputManager: InputManager;
    public mapManager: MapManager = new MapManager();
    public uiManager: UiManager;
    public enemyManager: EnemyManager;
    public turretManager: TurretManager;
    public player: Player = new Player(100, 10);

    constructor(canvas: HTMLCanvasElement) {

        this.inputManager = new InputManager(canvas);

        this.mapManager.setLevel(0);

        this.enemyManager = new EnemyManager(this.mapManager);        

        this.turretManager = new TurretManager(this.enemyManager);

        this.uiManager = new UiManager(this.inputManager, this.player, this.turretManager);
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

        this.turretManager.update(deltaTime);
    }
}