import { angleBetween, distance, Position, VectorA } from "../utils/utils";

import Turrets from "../../data/configs/turrets.json" assert { type: "json" };
import type InputManager from "../core/InputManager";
import { SETTINGS } from "../../data/configs/Settings";

export abstract class Turret {
    protected cooldown: number = 0;
    protected showRange: boolean = true;
    protected target: Position | null = null;
    protected shoots: Bullet[] = [];
    protected isHovering: boolean = false;
    protected name: string = "";

    constructor(
        protected turretRadius: number,
        protected range: number,
        protected damage: number,
        protected fireRate: number,
        protected shootSpeed: number,
        protected bulletRadius: number,
        protected x: number,
        protected y: number
    ) { }

    draw(ctx: CanvasRenderingContext2D): void {
        this.shoots.forEach(shoot => shoot.draw(ctx));
    };

    update(deltaTime: number, input: InputManager): void {

        this.isHovering = (distance({ x: this.x, y: this.y }, input.getMousePosition()) <= this.turretRadius) ? true : false;                 

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
            if (shoot.vector.x < 0 || shoot.vector.x > SETTINGS.CANVAS_WIDTH || shoot.vector.y < 0 || shoot.vector.y > SETTINGS.CANVAS_HEIGHT) {
                this.shoots.splice(index, 1);
            }
        });
    };

    shoot(target: Position): void {
        const angle = angleBetween({ x: this.x, y: this.y }, target);
        this.shoots.push(new Bullet(new VectorA(this.x, this.y, angle), this.shootSpeed, this.bulletRadius, this.damage));
    }

    setTarget(target: Position | null): void {
        this.target = target;
    }

    getName(): string {
        return this.name;
    }

    getRange(): number {
        return this.range;
    }

    getPosition(): Position {
        return { x: this.x, y: this.y };
    }

    getDamage(): number {
        return this.damage;
    }

    getFireRate(): number {
        return this.fireRate;
    }

    getShootSpeed(): number {
        return this.shootSpeed;
    }

    getBulletRadius(): number {
        return this.bulletRadius;
    }

    setShowRange(show: boolean): void {
        this.showRange = show;
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
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

    name = "Basic Turret";

    constructor(x: number, y: number) {

        const data = Turrets["BasicTurret"];

        super(30, data.range, data.damage, data.fireRate, data.shootSpeed, data.bulletRadius, x, y);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();

        if (this.showRange || this.isHovering) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
            ctx.fill();
        }

        this.shoots.forEach(shoot => shoot.draw(ctx));
    }
}

export class SniperTurret extends Turret {

    shoots: Bullet[] = [];

    name = "Sniper Turret";

    constructor(x: number, y: number) {
        const data = Turrets["SniperTurret"];
        super(30, data.range, data.damage, data.fireRate, data.shootSpeed, data.bulletRadius, x, y);
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
        if (this.showRange || this.isHovering) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fill();
        }

        super.draw(ctx);
    }
}

export class RapidFireTurret extends Turret {

    shoots: Bullet[] = [];

    name = "Rapid Fire Turret";

    constructor(x: number, y: number) {
        const data = Turrets["RapidFireTurret"];
        super(30, data.range, data.damage, data.fireRate, data.shootSpeed, data.bulletRadius, x, y);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
        if (this.showRange || this.isHovering) {
            ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
            ctx.fill();
        }

        super.draw(ctx);
    }
}

export const TurretsTypes = {
    "BasicTurret": BasicTurret,
    "SniperTurret": SniperTurret,
    "RapidFireTurret": RapidFireTurret
}