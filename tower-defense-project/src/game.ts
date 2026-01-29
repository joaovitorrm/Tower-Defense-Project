import { BasicEnemy, type Enemy } from "./Enemy";
import InputManager from "./InputManager";
import type MapManager from "./MapManager";
import { BasicTurret, RapidFireTurret, SniperTurret, Turret } from "./Turrets";
import { distance, Position } from "./utils";

export default class Game {

    turrets: Turret[] = [];
    enemies: Enemy[] = [];

    constructor(public input: InputManager, public map: MapManager) {
        map.setLevel(0);
        const spawnPoint = map.getSpawnPoint();

        if (spawnPoint) {
            this.enemies.push(new BasicEnemy(spawnPoint.x, spawnPoint.y, 20, 50, 15, 'down', map.getCollisionMap()));
            setInterval(() => {
                this.enemies.push(new BasicEnemy(spawnPoint.x, spawnPoint.y, 20, 50, 15, 'down', map.getCollisionMap()));
            }, 1000);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {

        this.map.draw(ctx);

        this.turrets.forEach(turret => turret.draw(ctx));

        this.enemies.forEach(enemy => { enemy.draw(ctx) });

    }

    update(deltaTime: number): void {

        const mousePos = this.input.getMousePosition();

        if (this.input.getMouseClicked()) {
            this.turrets.push(new RapidFireTurret(mousePos.x, mousePos.y));
        }

        this.enemies = this.enemies.filter((e) => {

            if (e.x > 800 || e.y > 600 || e.x < 0 || e.y < 0) {
                return false;
            }

            e.update(deltaTime);

            return e;
        })

        this.turrets.forEach(turret => {

            turret.update(deltaTime);

            turret.shoots.forEach((shoot, index) => {
                this.enemies = this.enemies.filter(enemy => {
                    if (distance({ x: shoot.x, y: shoot.y }, { x: enemy.x, y: enemy.y }) < 10) {
                        turret.shoots.splice(index, 1);
                        enemy.health -= turret.damage;
                        if (enemy.health <= 0) {
                            return false;
                        }
                    }
                    return true;
                });
            });

            let foundTarget: Position | null = null;

            for (const enemy of this.enemies) {
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