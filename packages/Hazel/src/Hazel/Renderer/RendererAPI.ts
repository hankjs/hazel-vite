import type { VertexArray } from "./VertexArray";
import { vec4 } from "gl-matrix";

export enum API {
    None = 0,
    WebGL = "WebGL",
    WebGL2 = "WebGL2",
    WebGPU = "WebGPU",
}

let s_API: API = import.meta.env.VITE_RENDERER as API;

export class RendererAPI {
    static getAPI(): API {
        return s_API;
    }

    //#region Implementation Partform
    setClearColor(color: vec4): void {
        throw new Error("Method not implemented.");
    }

    clear(): void {
        throw new Error("Method not implemented.");
    }

    drawIndexed(vertexArray: VertexArray): void {
        throw new Error("Method not implemented.");
    }
    //#endregion
}
