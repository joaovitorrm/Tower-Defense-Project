import { SETTINGS } from "../../data/configs/Settings";
import type { GameContext } from "../core/GameContext";
import { Screen } from "../core/Screen";
import { LabelButton, Panel } from "../ui/UiElement";
import { Rect } from "../utils/utils";

export default class LevelSelectorScreen extends Screen {

    private screenElement: Panel;

    constructor(private context: GameContext) {
        super();
        this.screenElement = new Panel(
            new Rect(0, 0, SETTINGS.CANVAS_WIDTH, SETTINGS.CANVAS_HEIGHT),
            null,
            "hsl(0, 0%, 20%)"
        )

        const columns = 3;
        const rows = 2;

        const padding = 40;
        const gap = 30;

        const boxWidth = (SETTINGS.CANVAS_WIDTH - padding * 2 - gap * (columns - 1)) / columns;

        const boxHeight = (SETTINGS.CANVAS_HEIGHT - padding * 2 - gap * (rows - 1)) / rows;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {

                const x = padding + col * (boxWidth + gap);
                const y = padding + row * (boxHeight + gap);

                const levelPanel = new Panel(
                    new Rect(x, y, boxWidth, boxHeight),
                    this.screenElement.getRect(),
                    "hsl(0, 0%, 30%)"
                );

                const selectBtn = new LabelButton(
                    new Rect(20, 20, 115, 40),
                    levelPanel.getRect(),
                    () => {
                        this.context.screenManager.changeScreen("game", 0);
                    },
                    () => "Select Level",
                    16,
                    "hsl(0, 0%, 90%)",
                    "black"
                )
                levelPanel.addChild(selectBtn);

                this.screenElement.addChild(levelPanel);
            }
        }

    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.screenElement.draw(ctx);
    }

    update(): void {
        this.screenElement.update(this.context.input);
    }

    onEnter(): void {

    }

    onExit(): void {

    }
}