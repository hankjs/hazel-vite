import { gl } from "./gl";

export class WebGL2Shader {
    constructor(vertexSource: string, fragmentSource: string) {
        // Create an empty vertex shader handle
        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = compileShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentSource,
        );
        const program = createProgram(gl, vertexShader, fragmentShader);

        this.rendererID = program as number;

        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    bind(): void {
        gl.useProgram(this.rendererID);
    }
    unbind(): void {
        gl.useProgram(null);
    }

    //#region Private Fields
    private rendererID: number;
    //#endregion
}

/**
 * Creates and compiles a shader.
 *
 * @param gl The WebGL Context.
 * @param shaderSource The GLSL source code for the shader.
 * @param shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return The shader.
 */
function compileShader(
    gl: WebGL2RenderingContext,
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
            "[Renderer] could not compile shader:" + gl.getShaderInfoLog(shader)
        );
    }

    return shader;
}

/**
 * Creates a program from 2 shaders.
 *
 * @param gl The WebGL context.
 * @param vertexShader A vertex shader.
 * @param fragmentShader A fragment shader.
 * @return A program.
 */
function createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
): WebGLProgram {
    // create a program.
    var program = gl.createProgram();
    if (!program) {
        throw "[Renderer] could not create WebGLProgram";
    }

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link; get the error
        throw (
            "[Renderer] program failed to link:" + gl.getProgramInfoLog(program)
        );
    }

    return program;
}
