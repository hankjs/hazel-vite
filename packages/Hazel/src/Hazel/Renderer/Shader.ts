import type { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";

export enum ShaderType {
    vertex = "vertex",
    fragment = "fragment",
}

export class Shader {
    constructor(name: string, source: string);
    constructor(name: string, vertexSource: string, fragmentSource: string);
    constructor(name: string, vertexSource: string, fragmentSource?: string) {
        this.name = name;
    }

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        return this.name;
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

    //#region Private Fields
    protected name: string;
    //#endregion
}

declare function create(name: string, filePath: string): Shader;
declare function create(
    name: string,
    vertexSource: string,
    fragmentSource: string,
): Shader;

export class ShaderLibrary {
    constructor() {}

    add(shader: Shader): void;
    add(name: string, shader: Shader): void;
    add(name: string | Shader, shader?: Shader) {
        if (!shader) {
            shader = name as Shader;
            name = shader.getName();
        }
        const _name = name as string;

        if (this.#shaders.has(_name)) {
            console.warn(`Shader '${_name}' already exists!`);
            return;
        }

        this.#shaders.set(_name, shader);
    }

    load(name: string, source: string): Shader;
    load(name: string, vertexSource: string, fragmentSource: string): Shader;
    load(name: string, vertexSource: string, fragmentSource?: string): Shader {
        const shader = Shader.create(name, vertexSource, fragmentSource ?? "");
        this.add(shader);
        return shader;
    }

    get(name: string): Shader {
        const shader = this.#shaders.get(name);
        if (!shader) {
            console.warn(`Shader '${name}' not found!`);
            return null as never;
        }

        return shader;
    }

    exists(name: string): boolean {
        return this.#shaders.has(name);
    }

    //#region Private Fields
    #shaders: Map<string, Shader> = new Map();
    //#endregion
}
