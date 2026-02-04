import InputManager from "./InputManager";
import MapManager from "./MapManager";
import { Turret } from "../entities/Turrets";
import { distance, Position } from "../utils/utils";

import { SETTINGS } from "../../data/configs/Settings";
import UiManager from "./UiManager";
import EnemyManager from "./EnemyManager";

export default class Game {

    turrets: Turret[] = [];

    public inputManager: InputManager;
    public mapManager: MapManager = new MapManager();;
    public uiManager: UiManager = new UiManager();
    public enemyManager: EnemyManager = new EnemyManager();

    constructor(canvas: HTMLCanvasElement) {

        this.inputManager = new InputManager(canvas);

        this.mapManager.setLevel(0);

        this.enemyManager.setLevel(0);

        this.enemyManager.setCollisionMap(this.mapManager.getCollisionMap());

        const spawnPoint = this.mapManager.getSpawnPoint();
        if (spawnPoint) {
            this.enemyManager.setSpawnPoint(spawnPoint.x, spawnPoint.y);
            this.enemyManager.spawnEnemies();
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.clearRect(0, 0, SETTINGS.CANVAS_WIDTH, SETTINGS.CANVAS_HEIGHT);

        this.mapManager.draw(ctx);

        this.turrets.forEach(turret => turret.draw(ctx));

        this.enemyManager.draw(ctx);

        this.uiManager.draw(ctx);
    }

    update(deltaTime: number): void {

        this.enemyManager.update(deltaTime);

        this.turrets.forEach(turret => {

            turret.update(deltaTime);

            turret.shoots.forEach((shoot, index) => {
                this.enemyManager.getEnemies().forEach(enemy => {
                    if (distance(
                        { x: shoot.vector.x, y: shoot.vector.y },
                        { x: enemy.x, y: enemy.y }
                    ) < shoot.radius + enemy.radius) {
                        enemy.health -= shoot.damage;
                        if (enemy.health <= 0) {
                            enemy.isDead = true;
                        }
                        turret.shoots.splice(index, 1);
                    }});
                });

                let foundTarget: Position | null = null;

                for (const enemy of this.enemyManager.getEnemies()) {
                    if (
                        distance(
                            { x: turret.x, y: turret.y },
                            { x: enemy.x, y: enemy.y }
                        ) <= turret.range
                    ) {
                        foundTarget = { x: enemy.x, y: enemy.y };
                        break; // PARA no primeiro
                    }
                }

                turret.target = foundTarget;
            });

        }
}