import { ShaderDataType } from "@pw/Hazel/Hazel/Renderer/Buffer";

export let gl: WebGL2RenderingContext;

export function setGL(context: WebGL2RenderingContext) {
    gl = new Proxy(context, {
        get(target, key, receiver) {
            const ret = Reflect.get(target, key, receiver);
            if (typeof ret === "function") {
                return ret.bind(target);
            }

            return ret;
        },
    });
}

export function shaderDataTypeToWebGL2BaseType(type: ShaderDataType) {
    // prettier-ignore
    switch (type) {
        case ShaderDataType.Float:    return gl.FLOAT;
        case ShaderDataType.Float2:   return gl.FLOAT;
        case ShaderDataType.Float3:   return gl.FLOAT;
        case ShaderDataType.Float4:   return gl.FLOAT;
        case ShaderDataType.Mat3:     return gl.FLOAT;
        case ShaderDataType.Mat4:     return gl.FLOAT;
        case ShaderDataType.Int:      return gl.INT;
        case ShaderDataType.Int2:     return gl.INT;
        case ShaderDataType.Int3:     return gl.INT;
        case ShaderDataType.Int4:     return gl.INT;
        case ShaderDataType.Bool:     return gl.BOOL;
    }

    return null as never
}