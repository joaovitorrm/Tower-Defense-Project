export default class InputManager {
    private x: number = 0;
    private y: number = 0;
    private isMouseDown: boolean = false;
    private keyPressed: string = '';

    constructor(canvas: HTMLCanvasElement) {
        canvas.addEventListener('pointermove', (e) => {
            const rect = canvas.getBoundingClientRect();

            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        });

        addEventListener('pointerdown', () => {
            this.isMouseDown = true;
        });

        addEventListener('pointerup', () => {
            this.isMouseDown = false;
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

    getMouseDown(): boolean {
        return this.isMouseDown;
    }

    getKeyPressed(): string {
        return this.keyPressed;
    }
}