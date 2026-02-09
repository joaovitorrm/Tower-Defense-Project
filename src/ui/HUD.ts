import { SETTINGS } from "../../data/configs/Settings";
import type InputManager from "../core/InputManager";
import type TurretManager from "../core/TurretManager";
import { Label, LabelButton, Panel, ToggleButton, UiElement } from "./UiElement";
import type Player from "../entities/Player";
import { BasicTurret, RapidFireTurret, SniperTurret } from "../entities/Turrets";

import { Rect } from "../utils/utils";
import type MapManager from "../core/MapManager";
import TurretPreview from "./TurretPreview";

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
            this.player.placingTurret.setPosition(mousePos.x, mousePos.y);

            if (input.getMouseDown() && !input.getMouseConsumed()) {
                input.consumeMouseClick();
                this.player.placingTurret.setShowRange(this.turretManager.isRangeVisible());
                this.turretManager.addTurret(this.player.placingTurret);
                this.player.placingTurret = null;
            }
        }
    }

    constructor(private player: Player, private turretManager: TurretManager, private mapManager: MapManager) {
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
            () => "Basic Turret",
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
            () => "Rapid Fire Turret",
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
            () => "Sniper Turret",
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
            () => this.turretManager.isRangeVisible() ? "Hide Range" : "Show Range",
            16,
            "white"
        );
        rightPanel.addChild(hideRangeLabel);

        // TURRET PREVIEW
        const turretPreview = new TurretPreview(
            new Rect(10, 100, rightPanel.getWidth() - 20, 280),
            rightPanel.getRect()
        );
        rightPanel.addChild(turretPreview);

        basicTurretButton.setHoverEnter(() => {
            turretPreview.setTurret(new BasicTurret(0, 0));
        });

        rapidFireTurretButton.setHoverEnter(() => {
            turretPreview.setTurret(new RapidFireTurret(0, 0));
        });

        sniperTurretButton.setHoverEnter(() => {
            turretPreview.setTurret(new SniperTurret(0, 0));
        });

        // MONEY LABEL
        const moneyLabel = new Label(
            new Rect(10, 10, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            () => `Money: $${this.player.getMoney()}`,
            16,
            "white"
        );
        rightPanel.addChild(moneyLabel);

        // HEALTH LABEL
        const healthLabel = new Label(
            new Rect(10, 40, rightPanel.getWidth() - 20, 40),
            rightPanel.getRect(),
            () => `Health: ${this.player.getLives()}`,
            16,
            "white"
        );
        rightPanel.addChild(healthLabel);


        // WAVE LABEL
        const waveLabel = new Label(
            new Rect(400, 10, 0, 0),
            this.getRect(),
            () => `Wave: ${this.mapManager.getLevel()+1}`,
            16,
            "white"
        );
        this.addChild(waveLabel);
    }
}