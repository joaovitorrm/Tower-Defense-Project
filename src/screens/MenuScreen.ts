import { SETTINGS } from "../../data/configs/Settings";
import type { GameContext } from "../core/GameContext";
import { Screen } from "../core/Screen"
import { LabelButton, Panel } from "../ui/UiElement";
import { Rect } from "../utils/utils";

export class MenuScreen extends Screen {

    private screenElement: Panel;

    constructor(private context: GameContext) {
        super();

        this.screenElement = new Panel(
            new Rect(0, 0, SETTINGS.CANVAS_WIDTH, SETTINGS.CANVAS_HEIGHT),
            null, 
            "hsl(0, 0%, 10%)"
        )

        const playBtn = new LabelButton(
            new Rect(500, 300, 88, 38),
            this.screenElement.getRect(),
            () => {
                context.screenManager.changeScreen("levels");
            },
            () => "JOGAR",
            20,
            "white",
            "hsl(100, 50%, 50%)"
        )
        this.screenElement.addChild(playBtn);
    }

    update(_: number): void {
        this.screenElement.update(this.context.input);
    }
    draw(ctx: CanvasRenderingContext2D): void {
        this.screenElement.draw(ctx);
    }
    onEnter(): void {

    }
    onExit(): void {

    }
}