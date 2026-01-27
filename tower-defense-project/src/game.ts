import InputManager from "./InputManager";
import type MapManager from "./MapManager";
import { Turret } from "./Turrets";
import { distance } from "./utils";

export default class Game {

    turrets : Turret[] = [];

    constructor(public input: InputManager, public map: MapManager) {
        map.setLevel(0);
    }

    draw(ctx: CanvasRenderingContext2D): void {

        this.map.draw(ctx, 40);

        this.turrets.forEach(turret => turret.draw(ctx));
    }

    update(deltaTime: number): void {

        this.turrets.forEach(turret => {

            const mousePos = this.input.getMousePosition();
            
            if (distance({x: turret.x, y: turret.y}, mousePos) <= turret.range) {
                turret.target = mousePos;
            } else {
                turret.target = null;
            }

            turret.update(deltaTime);
        });
    }
}