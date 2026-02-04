import { SETTINGS } from "../../data/configs/Settings";
import type InputManager from "../core/InputManager";
import type TurretManager from "../core/TurretManager";
import { Label, LabelButton, ToggleButton, UiElement } from "../core/UiElement";
import type Player from "../entities/Player";
import { BasicTurret, RapidFireTurret, SniperTurret } from "../entities/Turrets";

import { Rect } from "../utils/utils";

export class HUD extends UiElement {

    private width: number = SETTINGS.RIGHT_PANEL_WIDTH;
    private height: number = SETTINGS.CANVAS_HEIGHT;

    private x: number = SETTINGS.CANVAS_WIDTH - this.width;
    private y: number = 0;

    draw(ctx: CanvasRenderingContext2D) {

        if (this.player.placingTurret) {
            this.player.placingTurret.draw(ctx);
        }

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.children.forEach(element => element.draw(ctx));
    }

    update(input: InputManager): void {
        super.update(input);

        if (this.player.placingTurret !== null) {
            const mousePos = input.getMousePosition();
            this.player.placingTurret.x = mousePos.x;
            this.player.placingTurret.y = mousePos.y;

            if (input.getMouseDown() && !input.getMouseConsumed()) {
                input.consumeMouseClick();
                this.player.placingTurret.showRange = this.turretManager.isRangeVisible();
                this.turretManager.addTurret(this.player.placingTurret);
                this.player.placingTurret = null;
            }
        }
    }

    constructor(private player: Player, private turretManager: TurretManager) {
        super(new Rect(SETTINGS.CANVAS_WIDTH - SETTINGS.RIGHT_PANEL_WIDTH, 0, SETTINGS.RIGHT_PANEL_WIDTH, SETTINGS.CANVAS_HEIGHT));

        const basicTurretButton = new LabelButton(
            new Rect(10, 10, this.width - 20, 40),
            this.rect,
            () => {
                this.player.placingTurret = new BasicTurret(0, 0);
            },
            "Basic Turret"
        );
        this.addChild(basicTurretButton);

        const rapidFireTurretButton = new LabelButton(
            new Rect(10, 60, this.width - 20, 40),
            this.rect,
            () => {
                this.player.placingTurret = new RapidFireTurret(0, 0);
            },
            "Rapid Fire Turret"
        );
        this.addChild(rapidFireTurretButton);

        const sniperTurretButton = new LabelButton(
            new Rect(10, 110, this.width - 20, 40),
            this.rect,
            () => {
                this.player.placingTurret = new SniperTurret(0, 0);
            },
            "Sniper Turret"
        );
        this.addChild(sniperTurretButton);

        const hideRangeButton = new ToggleButton(
            new Rect(10, 160, 40, 40),
            this.rect,
            () => {
                this.turretManager.toggleRangeVisibility();
            },
            this.turretManager.isRangeVisible() ? true : false,
        );
        this.addChild(hideRangeButton);

        const hideRangeLabel = new Label(
            new Rect(60, 170, this.width - 70, 40),
            this.rect,
            "Show Range",
            "white"
        );
        this.addChild(hideRangeLabel);
    }
}