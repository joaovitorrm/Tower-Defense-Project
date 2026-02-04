import { angleBetween, Position, VectorA } from "../utils/utils";

import Turrets from "../../data/configs/turrets.json" assert { type: "json" };

export abstract class Turret {
    public cooldown: number = 0;
    public showRange: boolean = true;
    public target: Position | null = null;
    public shoots: Bullet[] = [];

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

class Bullet {
    constructor(
        public vector: VectorA,
        public speed: number,
        public radius: number,
        public damage: number
    ) { }

    update(deltaTime: number): void {
        this.vector.x += Math.cos(this.vector.a) * this.speed * deltaTime * 100;
        this.vector.y += Math.sin(this.vector.a) * this.speed * deltaTime * 100;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class BasicTurret extends Turret {

    shoots: Bullet[] = [];

    constructor(x: number, y: number) {

        const data = Turrets["BasicTurret"];

        super(data.range, data.damage, data.fireRate, data.shootSpeed, x, y);
    }

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new Bullet(new VectorA(this.x, this.y, angle), Turrets["BasicTurret"].shootSpeed, Turrets["BasicTurret"].bulletRadius, this.damage));
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

        this.shoots.forEach(shoot => shoot.draw(ctx));
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
            shoot.update(deltaTime);

            // Remove shoot if it goes out of bounds (for simplicity, assuming canvas size 800x600)
            if (shoot.vector.x < 0 || shoot.vector.x > 800 || shoot.vector.y < 0 || shoot.vector.y > 600) {
                this.shoots.splice(index, 1);
            }
        });
    }

    setTarget(target: Position | null): void {
        this.target = target;
    }
}

export class SniperTurret extends Turret {

    shoots : Bullet[] = [];

    constructor(x: number, y: number) {
        const data = Turrets["SniperTurret"];
        super(data.range, data.damage, data.fireRate, data.shootSpeed, x, y);
    }

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new Bullet(new VectorA(this.x, this.y, angle), Turrets["SniperTurret"].shootSpeed, Turrets["SniperTurret"].bulletRadius, this.damage));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
        if (this.showRange) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fill();
        }

        this.shoots.forEach(shoot => shoot.draw(ctx));
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
            shoot.update(deltaTime);

            // Remove shoot if it goes out of bounds (for simplicity, assuming canvas size 800x600)
            if (shoot.vector.x < 0 || shoot.vector.x > 800 || shoot.vector.y < 0 || shoot.vector.y > 600) {
                this.shoots.splice(index, 1);
            }
        });
    }
}

export class RapidFireTurret extends Turret {
    
    shoots : Bullet[] = [];

    constructor(x: number, y: number) {
        const data = Turrets["RapidFireTurret"];
        super(data.range, data.damage, data.fireRate, data.shootSpeed, x, y);
    }

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new Bullet(new VectorA(this.x, this.y, angle), Turrets["RapidFireTurret"].shootSpeed, Turrets["RapidFireTurret"].bulletRadius, this.damage));
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

        this.shoots.forEach(shoot => shoot.draw(ctx));
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
            shoot.update(deltaTime);

            // Remove shoot if it goes out of bounds (for simplicity, assuming canvas size 800x600)
            if (shoot.vector.x < 0 || shoot.vector.x > 800 || shoot.vector.y < 0 || shoot.vector.y > 600) {
                this.shoots.splice(index, 1);
            }
        });
    }
}