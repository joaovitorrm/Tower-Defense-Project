import type { Turret } from "../entities/Turrets";
import { Rect } from "../utils/utils";
import { Label, UiElement } from "./UiElement";

export default class TurretPreview extends UiElement {

    private turret: Turret | null = null;

    constructor(rect: Rect, parent: Rect | null = null) {
        super(rect, parent);

        const turretName = new Label(
            new Rect(0, 0, rect.width, 30),
            this.getRect(),
            () => `${this.turret ? this.turret.getName() : "No Turret Selected"}`,
            18,
            "white"
        );
        this.addChild(turretName);

        const turretDamage = new Label(
            new Rect(0, 40, rect.width, 25),
            this.getRect(),
            () => `${this.turret ? `Damage: ${this.turret.getDamage()}` : "Damage: 0"}`,
            14,
            "white"
        );
        this.addChild(turretDamage);

        const turretRange = new Label(
            new Rect(0, 70, rect.width, 25),
            this.getRect(),
            () => `${this.turret ? `Range: ${this.turret.getRange()}` : "Range: 0"}`,
            14,
            "white"
        );
        this.addChild(turretRange);

        const turretFireRate = new Label(
            new Rect(0, 100, rect.width, 25),
            this.getRect(),
            () => `${this.turret ? `Fire Rate: ${this.turret.getFireRate()}` : "Fire Rate: 0"}`,
            14,
            "white"
        );
        this.addChild(turretFireRate);
    }

    drawSelf(ctx: CanvasRenderingContext2D): void {
        const { x, y } = this.getAbsolutePosition();
        ctx.fillStyle = 'hsl(0, 0%, 12%)';
        ctx.fillRect(x, y, this.rect.width, this.rect.height);
    }

    setTurret(turret: Turret | null): void {
        this.turret = turret;
    }
}