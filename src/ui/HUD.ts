import { SETTINGS } from "../../data/configs/Settings";
import type InputManager from "../core/InputManager";
import type TurretManager from "../core/TurretManager";
import { Label, LabelButton, Panel, ToggleButton, UiElement } from "./UiElement";
import type Player from "../entities/Player";
import { BasicTurret, RapidFireTurret, SniperTurret } from "../entities/Turrets";

import { Rect } from "../utils/utils";

export class HUD extends UiElement {

    drawSelf(ctx: CanvasRenderingContext2D) {
        if (this.player.placingTurret) {
            this.player.placingTurret.draw(ctx);
        }
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
        super(new Rect(0, 0, SETTINGS.CANVAS_WIDTH, SETTINGS.CANVAS_HEIGHT));

        const rightPanel = new Panel(
            new Rect(SETTINGS.CANVAS_WIDTH - SETTINGS.RIGHT_PANEL_WIDTH, 0, SETTINGS.RIGHT_PANEL_WIDTH, SETTINGS.CANVAS_HEIGHT),
            this.rect,
            "black"
        );
        this.addChild(rightPanel);

        const basicTurretButton = new LabelButton(
            new Rect(10, 400, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            () => {
                this.player.placingTurret = new BasicTurret(0, 0);
            },
            "Basic Turret",
            16,
            "white",
            "hsl(0, 0%, 12%)"
        );
        rightPanel.addChild(basicTurretButton);

        const rapidFireTurretButton = new LabelButton(
            new Rect(10, 450, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            () => {
                this.player.placingTurret = new RapidFireTurret(0, 0);
            },            
            "Rapid Fire Turret",
            16,
            "white",
            "hsl(0, 0%, 12%)"
        );
        rightPanel.addChild(rapidFireTurretButton);

        const sniperTurretButton = new LabelButton(
            new Rect(10, 500, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            () => {
                this.player.placingTurret = new SniperTurret(0, 0);
            },
            "Sniper Turret",
            16,
            "white",
            "hsl(0, 0%, 12%)"
        );
        rightPanel.addChild(sniperTurretButton);

        const hideRangeButton = new ToggleButton(
            new Rect(10, 550, 40, 40),
            rightPanel.getRect(),
            () => {
                this.turretManager.toggleRangeVisibility();
            },
            this.turretManager.isRangeVisible() ? true : false,
        );
        rightPanel.addChild(hideRangeButton);

        const hideRangeLabel = new Label(
            new Rect(60, 560, rightPanel.getWidth() - 70, 40),
            rightPanel.getRect(),
            "Show Range",
            16,
            "white"
        );
        rightPanel.addChild(hideRangeLabel);

        const moneyLabel = new Label(
            new Rect(10, 10, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            `Money: $${this.player.getMoney()}`,
            16,
            "white"
        );
        rightPanel.addChild(moneyLabel);

        const healthLabel = new Label(
            new Rect(10, 40, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            `Health: ${this.player.getLives()}`,
            16,
            "white"
        );
        rightPanel.addChild(healthLabel);
    }
}