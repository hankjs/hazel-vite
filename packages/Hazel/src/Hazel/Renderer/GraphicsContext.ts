export abstract class GraphicsContext<E extends Element = Element> {
    constructor(el: E) {
        this.container = el;
    }

    //#region abstract methods implementation for platform
    init(): void {
        throw new Error("Method not implemented.");
    };
    swapBuffers(): void {
        throw new Error("Method not implemented.");
    };
    //#endregion

    //#region Private Fields
    protected container!: E;
}