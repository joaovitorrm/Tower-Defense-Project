import { BasicEnemy, FastEnemy, TankEnemy, type Enemy } from "../entities/Enemy";

import { levels } from "../../data/levels/levels";
import type MapManager from "./MapManager";
import { EventBusInstance } from "./EventBus";

const enemyTypes = {
    "basic": BasicEnemy,
    "fast": FastEnemy,
    "tank": TankEnemy
}

type Spawning = {
    type: keyof typeof enemyTypes,
    amount: number,
    interval: number,
    currentInterval: number,
    bounty: number
}

type EnemyWaveConfig = {
    type: keyof typeof enemyTypes;
    amount: number;
    interval: number;
    bounty: number;
};

type EnemyWaves = EnemyWaveConfig[][][];

type LevelData = {
    level: string[];
    enemyWaves: EnemyWaves;
};

export default class EnemyManager {
    private enemies: Enemy[] = [];
    private wave: number = 0;
    private spawningWave: number = 0;
    private level: number = 0;
    private levelData: LevelData = {} as LevelData;
    private levelCollisionMap: boolean[][] = [];
    private spawnPoint: { x: number, y: number } | null = null;
    private spawning: Spawning[] = [];

    constructor(private mapManager: MapManager) {
        this.levelCollisionMap = this.mapManager.getCollisionMap();
        this.spawnPoint = this.mapManager.getSpawnPoint();
        this.setLevel(this.mapManager.getLevel());

        this.spawnEnemies();
    }

    update(deltaTime: number) {

        for (const spawn of this.spawning) {
            spawn.currentInterval += deltaTime;
            if (spawn.currentInterval >= spawn.interval) {
                spawn.currentInterval = 0;
                if (spawn.amount > 0) {
                    this.spawn(spawn.type);
                    spawn.amount -= 1;
                }
            }
        }

        this.spawning = this.spawning.filter(s => s.amount > 0 || s.currentInterval > s.interval);

        if (this.spawning.length === 0 && this.enemies.length === 0) {
            this.spawningWave += 1;

            if (this.spawningWave >= this.levelData.enemyWaves[this.wave].length) {
                this.wave += 1;
                EventBusInstance.emit('waveChanged', { wave: this.wave + 1 });
                if (this.wave >= this.levelData.enemyWaves.length) {
                    this.wave = 0;
                    return;
                }
                this.spawningWave = 0;
            }

            this.spawnEnemies();
        }

        this.enemies.forEach(e => e.update(deltaTime));
        this.enemies = this.enemies.filter((e) => {
            if (e.isDead) {
                EventBusInstance.emit('enemyKilled', { enemy: e });
            }
            return !e.isDead;
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.enemies.forEach(e => e.draw(ctx));
    }

    getWave(): number {
        return this.wave;
    }

    setLevel(level: number): void {
        this.level = level;
        this.levelData = levels[level] as LevelData;
        this.wave = 0;
    }

    getLevel(): number {
        return this.level;
    }

    setSpawnPoint(x: number, y: number): void {
        this.spawnPoint = { x, y };
    }

    setCollisionMap(collisionMap: boolean[][]): void {
        this.levelCollisionMap = collisionMap;
    }

    spawnEnemies(): void {
        if (!this.spawnPoint) return;

        for (const enemy of this.levelData.enemyWaves[this.wave][this.spawningWave]) {
            this.spawning.push({
                type: enemy.type as keyof typeof enemyTypes,
                amount: enemy.amount,
                interval: enemy.interval,
                currentInterval: 0,
                bounty: enemy.bounty
            });
        }

        console.log(this.spawning);
    }

    spawn(enemyType: keyof typeof enemyTypes) {
        const EnemyClass = enemyTypes[enemyType];
        if (EnemyClass && this.spawnPoint) {
            const enemy = new EnemyClass(this.spawnPoint.x, this.spawnPoint.y);
            enemy.bounty = this.spawning.find(s => s.type === enemyType)?.bounty || 0;
            enemy.setCollisionMap(this.levelCollisionMap);
            this.enemies.push(enemy);
        }
    }

    getEnemies(): Enemy[] {
        return this.enemies;
    }

    clear() {
        this.enemies = [];
    }
}