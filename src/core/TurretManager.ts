import { Turret } from "../entities/Turrets";
import EnemyManager from "./EnemyManager";
import { distance, Position } from "../utils/utils";
import type InputManager from "./InputManager";

export default class TurretManager {
    private turrets: Turret[] = [];
    private showRange: boolean = false;

    constructor() {}

    addTurret(turret: Turret): void {
        this.turrets.push(turret);
    }

    removeTurret(turret: Turret): void {
        this.turrets = this.turrets.filter(t => t !== turret);
    }

    update(deltaTime: number, input: InputManager, enemyManager: EnemyManager): void {
        const enemies = enemyManager.getEnemies();

        this.turrets.forEach(turret => {

            // 🔍 Encontrar alvo
            let target: Position | null = null;
            for (const enemy of enemies) {
                if (
                    distance(
                        turret.getPosition(),
                        { x: enemy.x, y: enemy.y }
                    ) <= turret.getRange()
                ) {
                    target = { x: enemy.x, y: enemy.y };
                    break;
                }
            }
            turret.setTarget(target);

            // 🔫 Atualizar turret
            turret.update(deltaTime, input);

            // 💥 Colisão bala x inimigo
            turret.getShoots().forEach((shoot, shootIndex) => {
                enemies.forEach(enemy => {
                    if (
                        distance(
                            { x: shoot.vector.x, y: shoot.vector.y },
                            { x: enemy.x, y: enemy.y }
                        ) < shoot.radius + enemy.radius
                    ) {
                        enemy.health -= shoot.damage;
                        if (enemy.health <= 0) {
                            enemy.isDead = true;
                        }
                        turret.removeBulletByIndex(shootIndex);
                    }
                });
            });
        });
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.turrets.forEach(turret => turret.draw(ctx));
    }

    isRangeVisible(): boolean {
        return this.showRange;
    }

    toggleRangeVisibility(): void {
        this.showRange = !this.showRange;
        this.turrets.forEach(turret => turret.setShowRange(this.showRange));
    }

    clear(): void {
        this.turrets = [];
    }
}
