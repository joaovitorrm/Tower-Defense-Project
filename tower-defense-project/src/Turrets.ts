import { angleBetween, Position, VectorA } from "./utils";

export abstract class Turret {
    public cooldown: number = 0;
    public showRange: boolean = true;
    public target: Position | null = null;

    constructor(
        public range: number,
        public damage: number,
        public fireRate: number,
        public speed: number,
        public x: number,
        public y: number
    ) { }

    abstract shoot(target: Position): void;

    abstract draw(ctx: CanvasRenderingContext2D): void;

    abstract update(deltaTime: number): void;
}

export class BasicTurret extends Turret {

    shoots: VectorA[] = [];

    constructor(x: number, y: number) {
        super(120, 10, 1, 5, x, y);
    }

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new VectorA(this.x, this.y, angle));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();

        if (this.showRange) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
            ctx.fill();
        }

        this.shoots.forEach(shoot => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(shoot.x, shoot.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    update(deltaTime: number): void {
        if (this.cooldown >= 1 / this.fireRate) {
            if (this.target) {
                this.shoot(this.target);
                this.cooldown = 0;
            }
        } else {
            this.cooldown += deltaTime;
        }

        this.shoots.forEach((shoot, index) => {
            shoot.accelerate(this.speed, 1);

            // Remove shoot if it goes out of bounds (for simplicity, assuming canvas size 800x600)
            if (shoot.x < 0 || shoot.x > 800 || shoot.y < 0 || shoot.y > 600) {
                this.shoots.splice(index, 1);
            }
        });
    }

    setTarget(target: Position | null): void {
        this.target = target;
    }
}

export class SniperTurret extends Turret {

    shoots : VectorA[] = [];

    constructor(x: number, y: number) {
        super(300, 50, 0.5, 10, x, y);
    }

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new VectorA(this.x, this.y, angle));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
        if (this.showRange) {
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.fill();
        }

        this.shoots.forEach(shoot => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(shoot.x, shoot.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    update(deltaTime: number): void {
        if (this.cooldown >= 1 / this.fireRate) {
            if (this.target) {
                this.shoot(this.target);
                this.cooldown = 0;
            }
        } else {
            this.cooldown += deltaTime;
        }

        this.shoots.forEach((shoot, index) => {
            shoot.accelerate(this.speed, 1);

            // Remove shoot if it goes out of bounds (for simplicity, assuming canvas size 800x600)
            if (shoot.x < 0 || shoot.x > 800 || shoot.y < 0 || shoot.y > 600) {
                this.shoots.splice(index, 1);
            }
        });
    }
}

export class RapidFireTurret extends Turret {
    
    shoots : VectorA[] = [];

    constructor(x: number, y: number) {
        super(90, 1, 5, 8, x, y);
    }

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new VectorA(this.x, this.y, angle));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
        if (this.showRange) {
            ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
            ctx.fill();
        }

        this.shoots.forEach(shoot => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(shoot.x, shoot.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    update(deltaTime: number): void {
        if (this.cooldown >= 1 / this.fireRate) {
            if (this.target) {
                this.shoot(this.target);
                this.cooldown = 0;
            }
        } else {
            this.cooldown += deltaTime;
        }

        this.shoots.forEach((shoot, index) => {
            shoot.accelerate(this.speed, 1);

            // Remove shoot if it goes out of bounds (for simplicity, assuming canvas size 800x600)
            if (shoot.x < 0 || shoot.x > 800 || shoot.y < 0 || shoot.y > 600) {
                this.shoots.splice(index, 1);
            }
        });
    }
}