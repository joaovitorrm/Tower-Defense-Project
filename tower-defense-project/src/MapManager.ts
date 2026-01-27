import { levels } from "./maps/levels";

const tiles = {
    "#": "grey",
    ".": "green",
    "s": "yellow",
    "e": "red",
    " ": "white",
}

export default class MapManager {
    private level: number = 0;
    private map: any;
    private collisionMap: boolean[][] = [];

    constructor() {}

    setLevel(level: number): void {
        this.level = level;
        this.map = levels[level];
    }

    getLevel(): number {
        return this.level;
    }

    getCollision(y: number, x: number): boolean {
        return this.collisionMap[y][x];
    }

    draw(ctx: CanvasRenderingContext2D, tileSize: number): void {
        const level = this.map.level;
        
        for (let y = 0; y < level.length; y++) {
            for (let x = 0; x < level[y].length; x++) {
                console.log(level[y][x]);
                const tile = level[y][x];
                ctx.fillStyle = tiles[tile as keyof typeof tiles] || "purple";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }



}