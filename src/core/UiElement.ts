import { Rect } from "../utils/utils";
import type InputManager from "./InputManager";

export abstract class UiElement {

    protected children: UiElement[] = [];

    constructor(protected rect: Rect, protected parent: Rect | null = null) {}

    abstract draw(ctx: CanvasRenderingContext2D): void;

    getAbsolutePosition(): {x: number, y: number} {
        if (this.parent) {
            return {
                x: this.rect.x + this.parent.x,
                y: this.rect.y + this.parent.y
            };
        } else {
            return {
                x: this.rect.x,
                y: this.rect.y
            };
        }
    }

    update(input: InputManager): void {
        this.children.forEach(child => child.update(input));
    }

    addChild(child: UiElement): void {
        this.children.push(child);
    }

    getRect(): Rect {
        const {x, y} = this.getAbsolutePosition()
        return new Rect(x, y, this.rect.width, this.rect.height);
    }
}

export class Button extends UiElement {
    constructor(rect: Rect, parent: Rect | null = null, private onClick: () => void) {
        super(rect, parent);
    }

    click(): void {
        this.onClick();
    }

    update(input: InputManager): void {
        super.update(input);
        if (input.getMouseDown() && !input.getMouseConsumed() && this.getRect().collidesWith(input.getRect())) {
            input.consumeMouseClick();
            this.click();
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = 'gray';
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
    }

}

export class LabelButton extends Button {
    constructor(rect: Rect, parent: Rect | null = null, onClick: () => void, private label: string, private color: string = 'black') {
        super(rect, parent, onClick);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.color;
        ctx.font = '16px Arial';
        ctx.fillText(this.label, pos.x + 10, pos.y + this.rect.height / 2 + 6);
    }
}

export class ToggleButton extends Button {

    constructor(rect: Rect, parent: Rect | null = null, private onToggle: (state: boolean) => void, private toggled: boolean = false) {
        super(rect, parent, () => {
            this.toggled = !this.toggled;
            this.onToggle(this.toggled);
        });
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.toggled ? 'green' : 'red';
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
    }
}

export class Panel extends UiElement {
    constructor(rect: Rect, parent: Rect | null = null) {
        super(rect, parent);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
    }

}

export class Label extends UiElement {
    constructor(rect: Rect, parent: Rect | null = null, private text: string, private color: string = 'black') {
        super(rect, parent);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.color;
        ctx.font = '16px Arial';
        ctx.fillText(this.text, pos.x, pos.y + 16);
    }

    setText(newText: string): void {
        this.text = newText;
    }

    getText(): string {
        return this.text;
    }
}