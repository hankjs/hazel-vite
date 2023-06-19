import * as Interface from "@pw/Hazel/Hazel/Renderer/Buffer";
import { gl } from "./gl";

export class WebGL2VertexBuffer extends Interface.VertexBuffer {
    constructor(vertices: ArrayBufferView, size: number) {
        super(vertices, size);
        this.#rendererId = gl.createBuffer() as number;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#rendererId);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    bind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#rendererId);
    }
    unbind(): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    //#region Private Fields
    #rendererId: number = 0;
    //#endregion
}


export class WebGL2IndexBuffer extends Interface.IndexBuffer {
    constructor(indices: ArrayBufferView, count: number) {
        super(indices, count);
        this.#rendererId = gl.createBuffer() as number;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#rendererId);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    bind(): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#rendererId);
    }
    unbind(): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);
    }

    //#region Private Fields
    #rendererId: number = 0;
    //#endregion
}
