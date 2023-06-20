import type { IndexBuffer, VertexBuffer } from "./Buffer";

export class VertexArray {
    constructor() {}

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }
    addVertexBuffer(buffer: VertexBuffer): void {
        throw new Error("Method not implemented.");
    }
    addIndexBuffer(buffer: IndexBuffer): void {
        throw new Error("Method not implemented.");
    }

    static create: () => VertexArray;
}
