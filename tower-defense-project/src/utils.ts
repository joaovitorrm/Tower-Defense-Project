export class Position {
    constructor(public x: number, public y: number) {}
}

export class Rect {
    constructor(public x: number, public y: number, public width: number, public height: number) {}

    collidesWith(other: Rect): boolean {
        return !(
            this.x + this.width < other.x ||
            this.x > other.x + other.width ||
            this.y + this.height < other.y ||
            this.y > other.y + other.height
        );
    }
}

export class VectorA {
  constructor(public x: number, public y: number, public a: number) {}

  accelerate(speed: number, deltaTime: number): void {
    this.x += Math.cos(this.a) * speed * deltaTime;
    this.y += Math.sin(this.a) * speed * deltaTime;
  }
}

export function distance(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isInRange(turretPos: Position, targetPos: Position, range: number): boolean {
  return distance(turretPos, targetPos) <= range;
}

export function angleBetween(a: Position, b: Position): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}