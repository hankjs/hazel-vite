import { RenderCommand } from "./RenderCommand";
import type { VertexArray } from "./VertexArray";


export class Renderer {
    static beginScene(): void {
    }

    static endScene(): void {
    }

    static submit(vertexArray: VertexArray): void {
        vertexArray.bind();
        RenderCommand.drawIndexed(vertexArray);
    }
}