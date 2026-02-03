import { levels } from "./maps/levels";
import { SETTINGS } from "./Settings";

const tiles = {
    "#": "grey",
    ".": "green",
    "s": "yellow",
    "e": "red",
    " ": "white",
}

export default class MapManager {
    private level: number = 0;
    private tileSize: number = SETTINGS.TILE_SIZE;
    private map: any;
    private collisionMap: boolean[][] = [];
    private spawnPoint: {x: number, y: number} | null = null;

    constructor() {}

    setLevel(level: number): void {
        this.level = level;
        this.map = levels[level];
        this.parseMap();
    }

    private parseMap(): void {
        const level = this.map.level;
        this.collisionMap = [];
        this.spawnPoint = null;

        for (let y = 0; y < level.length; y++) {
            this.collisionMap[y] = [];
            for (let x = 0; x < level[y].length; x++) {
                const tile = level[y][x];
                this.collisionMap[y][x] = tile === "#" || tile === "e" || tile === "s";
                if (tile === "s") {
                    this.spawnPoint = {x: x * this.tileSize, y: y * this.tileSize};
                }
            }
        }
    }

    getLevel(): number {
        return this.level;
    }

    getCollisionMap(): boolean[][] {
        return this.collisionMap;
    }

    getCollision(y: number, x: number): boolean {
        return this.collisionMap[y][x];
    }

    getSpawnPoint(): {x: number, y: number} | null {
        return this.spawnPoint;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const level = this.map.level;
        
        for (let y = 0; y < level.length; y++) {
            for (let x = 0; x < level[y].length; x++) {
                const tile = level[y][x];
                ctx.fillStyle = tiles[tile as keyof typeof tiles] || "purple";
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }



}