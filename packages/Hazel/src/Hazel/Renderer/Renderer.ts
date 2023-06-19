export enum RendererAPI {
    None = 0,
    WebGL = "WebGL",
    WebGL2 = "WebGL2",
    WebGPU = "WebGPU",
}

let s_RendererAPI: RendererAPI = import.meta.env.VITE_RENDERER as RendererAPI;

export class Renderer {
    static getAPI(): RendererAPI {
        return s_RendererAPI;
    }
}