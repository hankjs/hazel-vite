export class Texture {
    //#region implementation for Platform
    getWidth(): number {
        throw new Error("Method not implemented.");
    }
    getHeight(): number {
        throw new Error("Method not implemented.");
    }
    bind(slot = 0) {
        throw new Error("Method not implemented.");
    }
    //#endregion
}

export class Texture2D extends Texture {
    static create: (path: string) => Texture2D;
}
