export abstract class Screen {
    abstract update(delta: number) : void;
    abstract draw(ctx: CanvasRenderingContext2D) : void;
    abstract onEnter?() : void;
    abstract onExit?() : void;
}