import type { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";

export enum ShaderType {
    vertex = "vertex",
    fragment = "fragment",
}

export class Shader {
    constructor(vertexSource: string, fragmentSource: string) {}

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }

    //#region Upload Uniforms implementation for Platform
    uploadUniformInt(name: string, value: number): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformFloat(name: string, value: number): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformFloat2(name: string, value: vec2 | [number, number]): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformFloat3(
        name: string,
        value: vec3 | [number, number, number],
    ): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformFloat4(
        name: string,
        value: vec4 | [number, number, number, number],
    ): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformMat3(
        name: string,
        matrix: mat3 | [number, number, number],
    ): void {
        throw new Error("Method not implemented.");
    }

    uploadUniformMat4(name: string, matrix: Float32Array | mat4): void {
        throw new Error("Method not implemented.");
    }
    //#endregion

    static create: typeof create;
}

declare function create(filePath: string): Shader;
declare function create(vertexSource: string, fragmentSource: string): Shader;
