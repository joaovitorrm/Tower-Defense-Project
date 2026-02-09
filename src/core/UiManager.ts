import type Player from "../entities/Player";
import { HUD } from "../ui/HUD";
import type InputManager from "./InputManager";
import type TurretManager from "./TurretManager";
import { UiElement } from "../ui/UiElement";

export default class UiManager {
    uiElements: UiElement[] = [];

    constructor(private inputManager: InputManager, private player: Player, private turretManager: TurretManager) {
        this.loadHUD();
    }

    addElement(element: UiElement): void {
        this.uiElements.push(element);
    }

    removeElement(element: UiElement): void {
        this.uiElements = this.uiElements.filter(el => el !== element);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.uiElements.forEach(element => {
            element.draw(ctx);
        });
    }

    update(): void {
        this.uiElements.forEach(element => {
            element.update(this.inputManager);
        });
    }

    loadHUD(): void {
        const hud = new HUD(this.player, this.turretManager);
        this.addElement(hud);
    }
}

