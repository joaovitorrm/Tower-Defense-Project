import type { Position } from "./utils";


type direction = 'left' | 'right' | 'up' | 'down';

export abstract class Enemy {
     constructor(
        public health: number,
        public speed: number,
        public direction: direction,
        public x: number,
        public y: number
     ) {}
}

export class BasicEnemy extends Enemy {

    collisions : boolean[][] = [];
    hasColided: boolean = false;

    constructor(x: number, y: number, direction: direction) {
        super(100, 50, direction, x, y);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    setCollisions(collisionMap: boolean[][]): void {
        this.collisions = collisionMap;
    }

    update(deltaTime: number): void {

        if (this.hasColided) return;

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

    checkCollision(): boolean {

        let x = this.x;
        let y = this.y;

        if (this.direction === 'left') {
            x -=  15;
        } else if (this.direction === 'right') {
            x += 15;
        } else if (this.direction === 'up') {
            y -= 15;
        } else if (this.direction === 'down') {
            y += 15;
        }

        const tileX = x % 40;
        const tileY = y % 40;
        return this.collisions[tileX][tileY];
    }
}