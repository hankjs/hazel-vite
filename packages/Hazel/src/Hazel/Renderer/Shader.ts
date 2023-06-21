import type { mat4 } from "gl-matrix";

export class Shader {
    constructor(vertexSource: string, fragmentSource: string) { }

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformMat4(name: string, matrix: Float32Array | mat4): void {
        throw new Error("Method not implemented.");
    }

    static create: (vertexSource: string, fragmentSource: string) => Shader 
}
