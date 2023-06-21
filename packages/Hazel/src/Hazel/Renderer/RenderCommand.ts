import { vec4 } from "gl-matrix";
import type { RendererAPI } from "./RendererAPI";
import type { VertexArray } from "./VertexArray";

let s_rendererAPI: RendererAPI;

export function setRendererAPI(rendererAPI: RendererAPI): void {
    s_rendererAPI = rendererAPI;
}

export class RenderCommand {
    // implementation partform in ./index.ts
    static init: () => void;

    static setClearColor(color: vec4 | [number, number, number, number]): void {
        if (Array.isArray(color)) {
            color = vec4.fromValues(color[0], color[1], color[2], color[3]);
        }

        s_rendererAPI.setClearColor(color);
    }

    static clear(): void {
        s_rendererAPI.clear();
    }

    static drawIndexed(vertexArray: VertexArray): void {
        s_rendererAPI.drawIndexed(vertexArray);
    }

    static setViewport(x: number, y: number, width: number, height: number): void {
        s_rendererAPI.setViewport(x, y, width, height);
    }
}
