import type { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";
import { gl } from "./gl";
import { ShaderType } from "@pw/Hazel/Hazel/Renderer/Shader";

export class WebGL2Shader {
    constructor(vertexSource: string, fragmentSource: string) {
        //#region normalize shader source
        let shaderMap: Map<ShaderType, string>;
        if (fragmentSource) {
            shaderMap = new Map();
            shaderMap.set(ShaderType.vertex, vertexSource);
            shaderMap.set(ShaderType.fragment, fragmentSource);
        } else {
            shaderMap = this.preProcess(vertexSource);
            vertexSource = shaderMap.get(ShaderType.vertex)!;
            fragmentSource = shaderMap.get(ShaderType.fragment)!;
        }
        //#endregion

        // compile shader
        const shaderIds: WebGLShader[] = [];
        // Create an empty vertex shader handle
        for (const type of shaderMap.keys()) {
            shaderIds.push(
                this.compileShader(
                    type2WebGL2ShaderType(type),
                    shaderMap.get(type)!,
                ),
            );
        }

        // link shader program
        const program = this.createProgram(shaderIds);
        this.rendererID = program as number;
        // clean up
        for (let i = 0; i < shaderIds.length; i++) {
            const shader = shaderIds[i];
            gl.detachShader(program, shader);
            gl.deleteShader(shader);
        }
    }

    bind(): void {
        gl.useProgram(this.rendererID);
    }
    unbind(): void {
        gl.useProgram(null);
    }

    uploadUniformInt(name: string, value: number): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniform1i(location, value);
    }

    uploadUniformFloat(name: string, value: number): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniform1f(location, value);
    }

    uploadUniformFloat2(name: string, value: vec2 | [number, number]): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniform2f(location, value[0], value[1]);
    }

    uploadUniformFloat3(
        name: string,
        value: vec3 | [number, number, number],
    ): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniform3f(location, value[0], value[1], value[2]);
    }

    uploadUniformFloat4(
        name: string,
        value: vec4 | [number, number, number, number],
    ): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
    }

    uploadUniformMat3(
        name: string,
        matrix: mat3 | [number, number, number],
    ): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniformMatrix4fv(location, false, matrix);
    }

    uploadUniformMat4(
        name: string,
        matrix: mat4 | [number, number, number, number],
    ): void {
        const location = gl.getUniformLocation(this.rendererID, name);
        gl.uniformMatrix4fv(location, false, matrix);
    }

    //#region Private Fields
    private rendererID: number;
    //#endregion

    //#region Private Methods
    /**
     * @param source vertex or fragment shader source code
     */
    private preProcess(source: string): Map<ShaderType, string> {
        const lines = source.split("\n");
        const result = new Map<ShaderType, string>();

        let type: ShaderType | null = null;
        const typeLines: string[] = [];
        for (const text of lines) {
            const match = text.match(/#type\s+(.*)/);
            if (match) {
                if (type) {
                    result.set(type, typeLines.join("\n"));
                    typeLines.length = 0;
                }
                type = match[1] as ShaderType;
            } else {
                typeLines.push(text);
            }
        }
        if (type && typeLines.length > 0 && !result.has(type)) {
            result.set(type, typeLines.join("\n"));
        }

        return result;
    }

    /**
     * Creates and compiles a shader.
     *
     * @param shaderSource The GLSL source code for the shader.
     * @param shaderType The type of shader, VERTEX_SHADER or
     *     FRAGMENT_SHADER.
     * @return The shader.
     */
    private compileShader(
        shaderType: number,
        shaderSource: string,
    ): WebGLShader {
        // Create the shader object
        var shader = gl.createShader(shaderType);
        if (!shader) {
            throw `[Renderer] could not create Shader: ${shaderType}`;
        }

        // Set the shader source code.
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check if it compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            // Something went wrong during compilation; get the error
            throw (
                "[Renderer] could not compile shader:" +
                gl.getShaderInfoLog(shader)
            );
        }

        return shader;
    }

    /**
     * Creates a program from 2 shaders.
     *
     * @param vertexShader A vertex shader.
     * @param fragmentShader A fragment shader.
     * @return A program.
     */
    private createProgram(shaders: WebGLShader[]): WebGLProgram {
        // create a program.
        var program = gl.createProgram();
        if (!program) {
            throw "[Renderer] could not create WebGLProgram";
        }

        // attach the shaders.
        for (let i = 0; i < shaders.length; i++) {
            const shader = shaders[i];
            gl.attachShader(program, shader);
        }

        // link the program.
        gl.linkProgram(program);

        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // something went wrong with the link; get the error
            throw (
                "[Renderer] program failed to link:" +
                gl.getProgramInfoLog(program)
            );
        }

        return program;
    }

    //#endregion
}

function type2WebGL2ShaderType(type: ShaderType): number {
    // prettier-ignore
    switch (type) {
        case ShaderType.vertex  :      return gl.VERTEX_SHADER;
        case ShaderType.fragment:    return gl.FRAGMENT_SHADER;
    }

    return null as never;
}
