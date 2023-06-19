export class VertexBuffer {
    constructor(vertices: ArrayBufferView, size: number) {}

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }

    static create: (vertices: ArrayBufferView, size: number) => VertexBuffer;
}

export class IndexBuffer {
    constructor(indices: ArrayBufferView, count: number) {
        this.count = count;
    }

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }

    getCount(): number {
        return this.count;
    }

    static create: (indices: ArrayBufferView, size: number) => IndexBuffer;

    //#region Private Fields
    protected count: number = 0;
    //#endregion
}
