import { BasicEnemy, type Enemy } from "./Enemy";
import InputManager from "./InputManager";
import type MapManager from "./MapManager";
import { BasicTurret, RapidFireTurret, SniperTurret, Turret } from "./Turrets";
import { distance, Position, Rect } from "./utils";

import { SETTINGS } from "./Settings";
import type UiManager from "./UiManager";
import { Button, Panel } from "./UiManager";

export default class Game {

    turrets: Turret[] = [];
    enemies: Enemy[] = [];

    placingTurret: null | Turret = null;

    constructor(public input: InputManager, public map: MapManager, public uiManager: UiManager) {
        this.loadUi();
        map.setLevel(0);
        const spawnPoint = map.getSpawnPoint();

        if (spawnPoint) {
            this.enemies.push(new BasicEnemy(spawnPoint.x, spawnPoint.y, 20, 50, 15, 'down', map.getCollisionMap()));
            setInterval(() => {
                this.enemies.push(new BasicEnemy(spawnPoint.x, spawnPoint.y, 20, 50, 15, 'down', map.getCollisionMap()));
            }, 1000);
        }
    }

    loadUi(): void {
        const panelRect = new Rect(10, 350, 150, 200);
        // Add buttons for turrets
        const basicTurretButton = new Button(
            new Rect(10, 10, 130, 30),
            panelRect,
            () => {
                this.placingTurret = new BasicTurret(0, 0);
            }
        );

        const rapidFireTurretButton = new Button(
            new Rect(10, 50, 130, 30),
            panelRect,
            () => {
                this.placingTurret = new RapidFireTurret(0, 0);
            }
        );

        const sniperTurretButton = new Button(
            new Rect(10, 90, 130, 30),
            panelRect,
            () => {
                this.placingTurret = new SniperTurret(0, 0);
            }
        );

        const panel = new Panel(panelRect);
        this.uiManager.addElement(panel);
        this.uiManager.addElement(basicTurretButton);
        this.uiManager.addElement(rapidFireTurretButton);
        this.uiManager.addElement(sniperTurretButton);
    }

    draw(ctx: CanvasRenderingContext2D): void {

        this.map.draw(ctx);

        this.turrets.forEach(turret => turret.draw(ctx));

        this.enemies.forEach(enemy => { enemy.draw(ctx) });

        this.uiManager.draw(ctx);

        if (this.placingTurret) {
            const mousePos = this.input.getMousePosition();
            this.placingTurret.x = mousePos.x;
            this.placingTurret.y = mousePos.y;
            this.placingTurret.draw(ctx);
        }
    }

    update(deltaTime: number): void {

        const mousePos = this.input.getMousePosition();

        this.enemies = this.enemies.filter((e) => {

            if (e.x > SETTINGS.CANVAS_WIDTH || e.y > SETTINGS.CANVAS_HEIGHT || e.x < 0 || e.y < 0) {
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

        this.uiManager.uiElements.forEach(el => {
            if (el instanceof Button) {
                if (el.getRect().collidesWith(new Rect(mousePos.x, mousePos.y, 1, 1))) {
                    if (this.input.getMouseClicked()) {
                        el.click();
                    }
                }
            }
        })

        if (this.input.getMouseClicked()) {
            if (this.placingTurret !== null) {
                this.turrets.push(this.placingTurret);
                this.placingTurret = null;
            }
        }

    }
}