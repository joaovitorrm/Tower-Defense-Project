import { SETTINGS } from "./Settings";
import type { Position } from "./utils";


type direction = 'left' | 'right' | 'up' | 'down';

const directions: direction[] = ['left', 'right', 'up', 'down'];
const oppositeDirections: { [key in direction]: direction } = {
    'left': 'right',
    'right': 'left',
    'up': 'down',
    'down': 'up'
};

export abstract class Enemy {

    protected hasColided: boolean = false;

    constructor(
        public x: number,
        public y: number,
        public health: number,
        public speed: number,
        public direction: direction,
        protected collisions: boolean[][] = []
    ) { }

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract update(deltaTime: number): void;
}

export class BasicEnemy extends Enemy {

    private radius: number = 15;

    constructor(x: number, y: number, health: number, speed: number, radius: number, direction: direction, collisionMap: boolean[][]) {
        super(x, y + radius + 5, health, speed, direction, collisionMap);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(deltaTime: number): void {

        if (!this.checkCollision()) {
            this.changeDirection();
        };

        switch (this.direction) {
            case 'left':
                this.x -= this.speed * deltaTime;
                break;
            case 'right':
                this.x += this.speed * deltaTime;
                break;
            case 'up':
                this.y -= this.speed * deltaTime;
                break;
            case 'down':
                this.y += this.speed * deltaTime;
                break;
        }
    }

    checkCollision(dir?: direction): boolean {

        const tileSize = SETTINGS.TILE_SIZE;

        const gap = this.radius + (this.radius / 2);

        let x = this.x;
        let y = this.y;

        dir = dir || this.direction;

        switch (dir) {
            case 'left':
                x -= gap;
                break;
            case 'right':
                x += gap;
                break;
            case 'up':
                y -= gap;
                break;
            case 'down':
                y += gap;
                break;
        }

        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);

        return !!this.collisions[tileY]?.[tileX];
    }

    changeDirection(): void {
        const actualDirection = this.direction;
        for (const dir of directions) {
            if (dir !== actualDirection && dir !== oppositeDirections[actualDirection]) {
                if (this.checkCollision(dir)) {
                    this.direction = dir;
                    break;
                }
            }
        }
    }
}