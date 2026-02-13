import { GameScreen } from "../screens/GameScreen";
import LevelSelectorScreen from "../screens/LevelSelectorScreen";
import { MenuScreen } from "../screens/MenuScreen";
import type { GameContext } from "./GameContext";
import type { Screen } from "./Screen";

const Screens = {
    menu: (ctx: GameContext) => new MenuScreen(ctx),
    game: (ctx: GameContext, level: number) => new GameScreen(ctx, level),
    levels: (ctx: GameContext) => new LevelSelectorScreen(ctx)
} as const;

type ScreenName = keyof typeof Screens;

type ScreenFactory = (ctx: GameContext, ...args: any[]) => Screen;

export default class ScreenManager {

    private currentScreen: Screen | null = null;

    private loadedScreens: Map<string, Screen> = new Map();

    constructor(private context: GameContext) { }

    changeScreen(name: ScreenName, ...args: any[]): void {

        this.currentScreen?.onExit?.();

        if (name === "game") {
            const factory = Screens[name] as ScreenFactory;
            this.currentScreen = factory(this.context, ...args);
        }
        else {

            const cached = this.loadedScreens.get(name);

            if (cached) {
                this.currentScreen = cached;
            } else {
                const factory = Screens[name] as ScreenFactory;
                this.currentScreen = factory(this.context, ...args);
                this.loadedScreens.set(name, this.currentScreen);
            }
        }

        this.currentScreen?.onEnter?.();
    }

    update(delta: number): void {
        this.currentScreen?.update(delta);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.currentScreen?.draw(ctx);
    }
}