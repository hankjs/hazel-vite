import { Renderer } from "./Renderer";
import { RendererAPI, API } from "./RendererAPI";
import { GraphicsContext } from "./GraphicsContext";
import { IndexBuffer, VertexBuffer } from "./Buffer";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";
import { RenderCommand, setRendererAPI } from "./RenderCommand";

//#region Renderer WebGL2
import { WebGL2GraphicsContext } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2GraphicsContext";
import {
    WebGL2VertexBuffer,
    WebGL2IndexBuffer,
} from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2Buffer";
import { WebGL2Shader } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2Shader";
import { WebGL2VertexArray } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2VertexArray";
import { WebGL2RendererAPI } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2RendererAPI";
//#endregion

//#region dynamic
GraphicsContext.create = function create<E extends HTMLElement = HTMLElement>(
    el: E,
): GraphicsContext {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2GraphicsContext(el);
    }

    // @ts-expect-error error build
    return null;
};

VertexBuffer.create = function create(
    vertices: ArrayBufferView,
    size: number,
): VertexBuffer {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2VertexBuffer(vertices, size);
    }

    // @ts-expect-error error build
    return null;
};
IndexBuffer.create = function create(
    indices: ArrayBufferView,
    size: number,
): IndexBuffer {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2IndexBuffer(indices, size);
    }

    // @ts-expect-error error build
    return null;
};

Shader.create = function create(
    vertexSource: string,
    fragmentSource: string,
): Shader {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2Shader(vertexSource, fragmentSource);
    }

    // @ts-expect-error error build
    return null;
};

VertexArray.create = function create(): VertexArray {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2VertexArray();
    }

    // @ts-expect-error error build
    return null;
};

RenderCommand.init = function init(): void {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return setRendererAPI(new WebGL2RendererAPI());
    }

    // @ts-expect-error error build
    return null;
};
RenderCommand.init();
//#endregion

//#region export
export { GraphicsContext, IndexBuffer, VertexBuffer, Shader, VertexArray };

export { Renderer, RendererAPI, RenderCommand };

export * from "./Shader";
export {
    BufferElement,
    BufferLayout,
    ShaderDataType,
    shaderDataTypeSize,
} from "./Buffer";
export * from "./OrthographicCamera";
//#endregion
