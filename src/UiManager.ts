import { Rect } from "./utils";

export default class UiManager {
    uiElements: UiElement[] = [];

    constructor() {}

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
}

abstract class UiElement {
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

    draw(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = 'gray';
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
    }

}

export class LabelButton extends Button {
    constructor(rect: Rect, parent: Rect | null = null, onClick: () => void, private label: string) {
        super(rect, parent, onClick);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = 'black';
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
    constructor(rect: Rect, parent: Rect | null = null, private text: string) {
        super(rect, parent);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = 'black';
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

