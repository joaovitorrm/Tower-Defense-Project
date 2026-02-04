import { BasicEnemy, type Enemy } from "../entities/Enemy";

import {levels} from "../../data/levels/levels";

const enemyTypes = {
    "basic" : BasicEnemy,    
}

export default class EnemyManager {
    private enemies: Enemy[] = [];
    private wave : number = 0;
    private level : number = 0;
    private levelCollisionMap: boolean[][] = [];
    private spawnPoint: {x: number, y: number} | null = null;
    private isSpawning: boolean = false;
    private spawning: { amount: number, interval: number, current: number } = { amount: 0, interval: 0, current: 0 };
    private spawningIndex: number = 0;
    private spawnInterval: number = 0;

    update(deltaTime: number) {
        this.spawnInterval += deltaTime;

        if (this.isSpawning) {

            if (this.spawning.current < this.spawning.amount && this.spawnInterval >= this.spawning.interval) {
                this.spawning.current++;
                this.spawnInterval = 0;
                const enemyType = levels[this.level].enemyWaves[this.wave].enemies[this.spawningIndex].type;
                this.spawn(enemyType as keyof typeof enemyTypes);
            }
            if (this.spawning.current >= this.spawning.amount) {
                this.isSpawning = false;
            }
        }

        this.enemies.forEach(e => e.update(deltaTime));
        this.enemies = this.enemies.filter(e => !e.isDead);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.enemies.forEach(e => e.draw(ctx));
    }

    getWave() : number {
        return this.wave;
    }

    setLevel(level: number) : void {
        this.level = level;
        this.wave = 0;
    }

    getLevel() : number {
        return this.level;
    }

    setSpawnPoint(x: number, y: number) : void {
        this.spawnPoint = {x, y};
    }

    setCollisionMap(collisionMap: boolean[][]) : void {
        this.levelCollisionMap = collisionMap;
    }

    spawnEnemies() : void {
        if (!this.spawnPoint) return;

        if (!this.isSpawning) {
            this.isSpawning = true;
            this.spawning = {
                amount: levels[this.level].enemyWaves[this.wave].enemies[0].spawnAmount,
                interval: levels[this.level].enemyWaves[this.wave].enemies[0].spawnInterval,
                current: 0
            };
            this.spawningIndex = 0;
        }
    }

    spawn(enemyType : keyof typeof enemyTypes) {
        const EnemyClass = enemyTypes[enemyType];
        if (EnemyClass && this.spawnPoint) {
            const enemy = new EnemyClass(this.spawnPoint.x, this.spawnPoint.y);
            enemy.setCollisionMap(this.levelCollisionMap);
            this.enemies.push(enemy);
        }
    }

    getEnemies() : Enemy[] {
        return this.enemies;
    }

    clear() {
        this.enemies = [];
    }
}