import { Turret } from "../entities/Turrets";
import EnemyManager from "./EnemyManager";
import { distance, Position } from "../utils/utils";

export default class TurretManager {
    private turrets: Turret[] = [];
    private showRange: boolean = true;

    constructor(private enemyManager: EnemyManager) {}

    addTurret(turret: Turret): void {
        this.turrets.push(turret);
    }

    removeTurret(turret: Turret): void {
        this.turrets = this.turrets.filter(t => t !== turret);
    }

    update(deltaTime: number): void {
        const enemies = this.enemyManager.getEnemies();

        this.turrets.forEach(turret => {

            // 🔍 Encontrar alvo
            let target: Position | null = null;
            for (const enemy of enemies) {
                if (
                    distance(
                        { x: turret.x, y: turret.y },
                        { x: enemy.x, y: enemy.y }
                    ) <= turret.range
                ) {
                    target = { x: enemy.x, y: enemy.y };
                    break;
                }
            }
            turret.target = target;

            // 🔫 Atualizar turret
            turret.update(deltaTime);

            // 💥 Colisão bala x inimigo
            turret.shoots.forEach((shoot, shootIndex) => {
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
                        turret.shoots.splice(shootIndex, 1);
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
        this.turrets.forEach(turret => turret.showRange = this.showRange);
    }

    clear(): void {
        this.turrets = [];
    }
}
