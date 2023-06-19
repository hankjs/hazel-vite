export class GraphicsContext<E extends HTMLElement = HTMLElement> {
    constructor(el: E) {
        this.container = el;
    }

    static create: <E extends HTMLElement = HTMLElement>(
        el: E,
    ) => GraphicsContext;

    //#region abstract methods implementation for platform
    init(): void {
        throw new Error("Method not implemented.");
    }
    swapBuffers(): void {
        throw new Error("Method not implemented.");
    }
    //#endregion

    //#region Private Fields
    protected container!: E;
}
