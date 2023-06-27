import { Renderer } from "./Renderer";
import { RendererAPI, API } from "./RendererAPI";
import { GraphicsContext } from "./GraphicsContext";
import { IndexBuffer, VertexBuffer } from "./Buffer";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";
import { RenderCommand, setRendererAPI } from "./RenderCommand";
import { Texture2D } from "./Texture";

//#region Renderer WebGL2
import { WebGL2GraphicsContext } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2GraphicsContext";
import {
    WebGL2VertexBuffer,
    WebGL2IndexBuffer,
} from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2Buffer";
import { WebGL2Shader } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2Shader";
import { WebGL2VertexArray } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2VertexArray";
import { WebGL2RendererAPI } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2RendererAPI";
import { WebGL2Texture2D } from "@pw/Hazel/Platform/Renderer/WebGL2/WebGL2Texture";
//#endregion

//#region dynamic
GraphicsContext.create = function create<E extends HTMLElement = HTMLElement>(
    el: E,
): GraphicsContext {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2GraphicsContext(el);
    }

    return null as never;
};

VertexBuffer.create = function create(
    vertices: ArrayBufferView,
    size: number,
): VertexBuffer {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2VertexBuffer(vertices, size);
    }

    return null as never;
};
IndexBuffer.create = function create(
    indices: ArrayBufferView,
    size: number,
): IndexBuffer {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2IndexBuffer(indices, size);
    }

    return null as never;
};

// @ts-expect-error overload
Shader.create = function create(
    name: string,
    vertexSource: string,
    fragmentSource: string,
): Shader {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2Shader(name, vertexSource, fragmentSource);
    }

    return null as never;
};

VertexArray.create = function create(): VertexArray {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2VertexArray();
    }

    return null as never;
};

Texture2D.create = function create(path): Texture2D {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return new WebGL2Texture2D(path);
    }

    return null as never;
};

function initRenderCommand(): void {
    if (RendererAPI.getAPI() === API.WebGL2) {
        return setRendererAPI(new WebGL2RendererAPI());
    }

    return null as never;
};
initRenderCommand();
//#endregion

//#region export
export * from "./Shader";
export * from "./OrthographicCamera";
export * from "./OrthographicCameraController";

export { GraphicsContext, IndexBuffer, VertexBuffer, Shader, VertexArray };

export { Texture2D };

export { Renderer, RendererAPI, RenderCommand };

export {
    BufferElement,
    BufferLayout,
    ShaderDataType,
    shaderDataTypeSize,
} from "./Buffer";
//#endregion
