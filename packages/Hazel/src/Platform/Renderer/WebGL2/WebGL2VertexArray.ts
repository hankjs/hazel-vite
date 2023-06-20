import { VertexArray } from "@pw/Hazel/Hazel/Renderer/VertexArray";
import type {
    IndexBuffer,
    VertexBuffer,
} from "@pw/Hazel/Hazel/Renderer/Buffer";
import { gl, shaderDataTypeToWebGL2BaseType } from "./gl";

export class WebGL2VertexArray extends VertexArray {
    constructor() {
        super();
        this.#rendererID = gl.createVertexArray() as number;
    }

    bind(): void {
        gl.bindVertexArray(this.#rendererID);
    }
    unbind(): void {
        gl.bindVertexArray(0);
    }

    addVertexBuffer(vertexBuffer: VertexBuffer): void {
        gl.bindVertexArray(this.#rendererID);
        vertexBuffer.bind();

        const layout = vertexBuffer.getLayout();
        let index = 0;
        for (const element of layout) {
            gl.enableVertexAttribArray(index);
            gl.vertexAttribPointer(
                index,
                element.getCount(),
                shaderDataTypeToWebGL2BaseType(element.type),
                element.normalized,
                layout.getStride(),
                element.offset,
            );
            index++;
        }

        this.#vertexBuffers.push(vertexBuffer);
    }

    addIndexBuffer(indexBuffer: IndexBuffer): void {
        gl.bindVertexArray(this.#rendererID);
        indexBuffer.bind();

        this.#indexBuffer = indexBuffer;
    }

    //#region Private Fields
    #rendererID: number;
    #vertexBuffers: VertexBuffer[] = [];
    #indexBuffer!: IndexBuffer;
    //#endregion
}
