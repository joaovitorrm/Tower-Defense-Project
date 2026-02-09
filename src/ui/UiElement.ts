import { Rect } from "../utils/utils";
import type InputManager from "../core/InputManager";

export abstract class UiElement {

    protected children: UiElement[] = [];
    protected isHovering: boolean = false;

    constructor(protected rect: Rect, protected parent: Rect | null = null) { }

    getAbsolutePosition(): { x: number, y: number } {
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

    getWidth(): number {
        return this.rect.width;
    }

    getHeight(): number {
        return this.rect.height;
    }

    getHovering(): boolean {
        return this.isHovering;
    }

    setHoverEnter(callback: () => void): void {
        this.onHoverEnter = callback;
    }

    setHoverExit(callback: () => void): void {
        this.onHoverExit = callback;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawSelf(ctx);
        this.drawChildren(ctx);
    }

    protected abstract drawSelf(ctx: CanvasRenderingContext2D): void;

    protected drawChildren(ctx: CanvasRenderingContext2D): void {
        this.children.forEach(child => child.draw(ctx));
    }

    update(input: InputManager): void {
        this.isHovering = this.getRect().collidesWith(input.getRect()) ? true : false;

        if (this.isHovering) {
            this.onHoverEnter();
        } else {
            this.onHoverExit();
        }
        
        this.children.forEach(child => child.update(input));
    }

    addChild(child: UiElement): void {
        this.children.push(child);
    }

    getRect(): Rect {
        const { x, y } = this.getAbsolutePosition()
        return new Rect(x, y, this.rect.width, this.rect.height);
    }

    protected onHoverEnter(): void { }
    
    protected onHoverExit(): void { }
}

export class Button extends UiElement {
    constructor(rect: Rect, parent: Rect | null = null, private onClick: () => void, protected backgroundColor: string = 'gray') {
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

    protected drawSelf(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);        
    }

}

export class LabelButton extends Button {
    constructor(rect: Rect, parent: Rect | null = null, onClick: () => void, private label: () => string, private fontSize: number = 16, private color: string = 'black', protected backgroundColor: string = 'lightgray') {
        super(rect, parent, onClick);
    }

    protected drawSelf(ctx: CanvasRenderingContext2D): void {
        super.drawSelf(ctx);
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px Arial`;
        ctx.fillText(this.label(), pos.x + 10, pos.y + this.rect.height / 2 + 6);
    }
}

export class ToggleButton extends Button {

    constructor(
        rect: Rect, 
        parent: Rect | null = null, 
        private onToggle: (state: boolean) => void, 
        private toggled: boolean = false, 
        protected backgroundColorOn: string = 'green',
        protected backgroundColorOff: string = 'red'
    ) {
        super(rect, parent, () => {
            this.toggled = !this.toggled;
            this.onToggle(this.toggled);
        });
    }

    protected drawSelf(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.toggled ? this.backgroundColorOn : this.backgroundColorOff;
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);        
    }
}

export class Panel extends UiElement {
    constructor(rect: Rect, parent: Rect | null = null, protected color: string = "lightgray") {
        super(rect, parent);
    }

    protected drawSelf(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.color;
        ctx.fillRect(pos.x, pos.y, this.rect.width, this.rect.height);
    }

}

export class Label extends UiElement {
    constructor(rect: Rect, parent: Rect | null = null, private text: () => string, private fontSize: number = 16, private color: string = 'black') {
        super(rect, parent);
    }

    protected drawSelf(ctx: CanvasRenderingContext2D): void {
        const pos = this.getAbsolutePosition();
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px Arial`;
        ctx.fillText(this.text(), pos.x, pos.y + this.fontSize);        
    }

    setText(newText: string): void {
        this.text = () => newText;
    }

    getText(): string {
        return this.text();
    }
}