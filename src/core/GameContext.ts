import type Player from "../entities/Player";
import type InputManager from "./InputManager";
import type ScreenManager from "./ScreenManager";

export interface GameContext {
    input: InputManager;
    player: Player;
    screenManager: ScreenManager;
}