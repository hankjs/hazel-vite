import type { VertexArray } from "@pw/Hazel/Hazel/Renderer/VertexArray";
import { RendererAPI } from "@pw/Hazel/Hazel/Renderer/RendererAPI";
import { gl } from "./gl";
import type { vec4 } from "gl-matrix";

export class WebGL2RendererAPI extends RendererAPI {
    init(): void {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    setClearColor(color: vec4): void {
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }

    clear(): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    drawIndexed(vertexArray: VertexArray): void {
        gl.drawElements(gl.TRIANGLES, vertexArray.getIndexBuffer().getCount(), gl.UNSIGNED_INT, 0);
    }

    setViewport(x: number, y: number, width: number, height: number): void {
        gl.viewport(x, y, width, height);
    }
}
