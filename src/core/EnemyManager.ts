import { BasicEnemy, FastEnemy, type Enemy } from "../entities/Enemy";

import {levels} from "../../data/levels/levels";
import type MapManager from "./MapManager";

const enemyTypes = {
    "basic" : BasicEnemy,
    "fast": FastEnemy
}

export default class EnemyManager {
    private enemies: Enemy[] = [];
    private wave : number = 0;
    private level : number = 0;
    private enemiesToSpawn: number = 0;
    private levelCollisionMap: boolean[][] = [];
    private spawnPoint: {x: number, y: number} | null = null;
    private isSpawning: boolean = false;
    private spawning: { amount: number, interval: number, current: number } = { amount: 0, interval: 0, current: 0 };
    private spawnInterval: number = 0;

    constructor(private mapManager: MapManager) {
        this.levelCollisionMap = this.mapManager.getCollisionMap();
        this.spawnPoint = this.mapManager.getSpawnPoint();
        this.setLevel(this.mapManager.getLevel());

        this.spawnEnemies();
    }

    update(deltaTime: number) {
        this.spawnInterval += deltaTime;

        if (this.isSpawning) {

            if (this.spawning.current < this.spawning.amount && this.spawnInterval >= this.spawning.interval) {
                this.spawning.current++;
                this.spawnInterval = 0;
                const enemyType = levels[this.level].enemyWaves[this.wave].enemies[this.enemiesToSpawn].type;
                this.spawn(enemyType as keyof typeof enemyTypes);
            }
            if (this.spawning.current >= this.spawning.amount) {
                this.isSpawning = false;
            }
        }

        if (!this.isSpawning && this.enemies.length === 0) {
            this.enemiesToSpawn++;
            if (this.enemiesToSpawn >= levels[this.level].enemyWaves[this.wave].enemies.length) {
                this.enemiesToSpawn = 0;
                this.wave++;
                if (this.wave >= levels[this.level].enemyWaves.length) {
                    this.wave = 0;
                    this.level++;
                    if (this.level >= levels.length) {
                        this.level = 0;
                    }
                    this.setLevel(this.level);
                }
            }
            this.spawnEnemies();
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
                amount: levels[this.level].enemyWaves[this.wave].enemies[this.enemiesToSpawn].spawnAmount,
                interval: levels[this.level].enemyWaves[this.wave].enemies[this.enemiesToSpawn].spawnInterval,
                current: 0
            };
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