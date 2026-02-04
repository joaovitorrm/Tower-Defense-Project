import { Rect } from "../utils/utils";

export default class InputManager {
    private x: number = 0;
    private y: number = 0;
    private isMouseDown: boolean = false;
    private isMouseConsumed: boolean = false;
    private keyPressed: string = '';

    constructor(canvas: HTMLCanvasElement) {
        canvas.addEventListener('pointermove', (e) => {
            const rect = canvas.getBoundingClientRect();

            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        });

        canvas.addEventListener('pointerdown', () => {
            this.isMouseDown = true;
        });

        window.addEventListener('pointerup', () => {
            this.isMouseDown = false;
            this.isMouseConsumed = false;
        });

        addEventListener('keydown', (e) => {
            this.keyPressed = e.key;
        });

        addEventListener('keyup', () => {
            this.keyPressed = '';
        });
    }

    getMousePosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    getRect(): Rect {
        return new Rect(this.x, this.y, 1, 1);
    }

    getMouseDown(): boolean {
        return this.isMouseDown;
    }

    getMouseConsumed(): boolean {
        return this.isMouseConsumed;
    }
    
    consumeMouseClick(): void {
        this.isMouseConsumed = true;
    }

    getKeyPressed(): string {
        return this.keyPressed;
    }
}