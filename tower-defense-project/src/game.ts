import { BasicEnemy, type Enemy } from "./Enemy";
import InputManager from "./InputManager";
import type MapManager from "./MapManager";
import { BasicTurret, RapidFireTurret, SniperTurret, Turret } from "./Turrets";
import { distance, Position, Rect } from "./utils";

import { SETTINGS } from "./Settings";
import type UiManager from "./UiManager";
import { Button, Label, LabelButton, Panel, ToggleButton } from "./UiManager";

export default class Game {

    turrets: Turret[] = [];
    enemies: Enemy[] = [];

    private rangeVisible: boolean = true;

    placingTurret: null | Turret = null;

    constructor(public input: InputManager, public map: MapManager, public uiManager: UiManager) {
        this.loadUi();
        map.setLevel(0);
        const spawnPoint = map.getSpawnPoint();

        if (spawnPoint) {
            this.enemies.push(new BasicEnemy(spawnPoint.x, spawnPoint.y, 200, 50, 15, 'down', map.getCollisionMap()));
            setInterval(() => {
                this.enemies.push(new BasicEnemy(spawnPoint.x, spawnPoint.y, 200, 50, 15, 'down', map.getCollisionMap()));
            }, 1000);
        }
    }

    changeRangeVisibility(state: boolean): void {
        this.rangeVisible = state;
        this.turrets.forEach(turret => {
            turret.showRange = this.rangeVisible;
        });
    }

    loadUi(): void {
        const panelRect = new Rect(10, 390, 150, 200);
        // Add buttons for turrets
        const basicTurretButton = new LabelButton(
            new Rect(10, 10, 130, 30),
            panelRect,
            () => {
                this.placingTurret = new BasicTurret(0, 0);
            },
            "Basic Turret"
        );

        const rapidFireTurretButton = new LabelButton(
            new Rect(10, 50, 130, 30),
            panelRect,
            () => {
                this.placingTurret = new RapidFireTurret(0, 0);
            },
            "Rapid Fire Turret"
        );

        const sniperTurretButton = new LabelButton(
            new Rect(10, 90, 130, 30),
            panelRect,
            () => {
                this.placingTurret = new SniperTurret(0, 0);
            },
            "Sniper Turret"
        );

        const toggleRangeButton = new ToggleButton(
            new Rect(10, 155, 30, 30),
            panelRect,
            (state: boolean) => {
                this.changeRangeVisibility(state);
            },
            this.rangeVisible
        )
        

        const labelToggleButton = new Label(
            new Rect(45, 160, 90, 30), panelRect, "Show Range"
        )

        const panel = new Panel(panelRect);
        this.uiManager.addElement(panel);
        this.uiManager.addElement(basicTurretButton);
        this.uiManager.addElement(rapidFireTurretButton);
        this.uiManager.addElement(sniperTurretButton);
        this.uiManager.addElement(toggleRangeButton);
        this.uiManager.addElement(labelToggleButton);
    }

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.clearRect(0, 0, SETTINGS.CANVAS_WIDTH, SETTINGS.CANVAS_HEIGHT);

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
                    if (distance({ x: shoot.vector.x, y: shoot.vector.y }, { x: enemy.x, y: enemy.y }) < (shoot.radius + enemy.radius)) {
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
                this.placingTurret.showRange = this.rangeVisible;
                this.turrets.push(this.placingTurret);                
                this.placingTurret = null;
            }
        }

    }
}