export enum ShaderDataType {
    None = 0,
    Float,
    Float2,
    Float3,
    Float4,
    Mat3,
    Mat4,
    Int,
    Int2,
    Int3,
    Int4,
    Bool,
}

export function shaderDataTypeSize(type: ShaderDataType) {
    // prettier-ignore
    switch (type) {
        case ShaderDataType.Float:       return 4;
        case ShaderDataType.Float2:      return 4 * 2;
        case ShaderDataType.Float3:      return 4 * 3;
        case ShaderDataType.Float4:      return 4 * 4;
        case ShaderDataType.Mat3:        return 4 * 3 * 3;
        case ShaderDataType.Mat4:        return 4 * 4 * 4;
        case ShaderDataType.Int:         return 4;
        case ShaderDataType.Int2:        return 4 * 2;
        case ShaderDataType.Int3:        return 4 * 3;
        case ShaderDataType.Int4:        return 4 * 4;
        case ShaderDataType.Bool:        return 1;
        default:
            throw new Error("Unknown ShaderDataType!");
    }
}

export class BufferElement {
    name: string;
    type: ShaderDataType;
    size: number = 0;
    offset: number = 0;
    normalized: boolean = false;

    static create(
        type: ShaderDataType,
        name: string,
        normalized: boolean = false,
    ): BufferElement {
        return new BufferElement(type, name, normalized);
    }

    constructor(type: ShaderDataType, name: string, normalized = false) {
        this.name = name;
        this.type = type;
        this.size = shaderDataTypeSize(type);
        this.normalized = normalized;
    }

    getCount(): number {
        // prettier-ignore
        switch (this.type) {
            case ShaderDataType.Float:       return 1;
            case ShaderDataType.Float2:      return 2;
            case ShaderDataType.Float3:      return 3;
            case ShaderDataType.Float4:      return 4;
            case ShaderDataType.Mat3:        return 3 * 4;
            case ShaderDataType.Mat4:        return 4 * 4;
            case ShaderDataType.Int:         return 1;
            case ShaderDataType.Int2:        return 2;
            case ShaderDataType.Int3:        return 3;
            case ShaderDataType.Int4:        return 4;
            case ShaderDataType.Bool:        return 1;
        
            default: return 0
        }
    }
}

export class BufferLayout {
    static create(elements: BufferElement[]): BufferLayout {
        return new BufferLayout(elements);
    }

    constructor(elements: BufferElement[]) {
        this.#elements = elements;
        this.calculateOffsetsAndStride()
    }

    getElements(): BufferElement[] {
        return this.#elements;
    }

    getStride(): number {
        return this.#stride;
    }

    [Symbol.iterator]() {
        let i = -1;
        return {
            next: () => {
                i++;
                if (i === this.#elements.length) {
                    return { done: true, value: this.#elements[i] };
                }

                return { done: false, value: this.#elements[i] };
            },
        };
    }

    //#region Private Methods
    calculateOffsetsAndStride() {
        let offset = 0;
        this.#stride = 0;
        for (const element of this.#elements) {
            element.offset = offset;
            offset += element.size;
            this.#stride += element.size;
        }
    }
    //#endregion

    //#region Private Fields
    #elements: BufferElement[] = [];
    #stride = 0;
    //#endregion
}

export class VertexBuffer {
    constructor(vertices: ArrayBufferView, size: number) {}

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }
    getLayout(): BufferLayout {
        return this.layout;
    }
    setLayout(layout: BufferLayout): void {
        this.layout = layout;
    }

    static create: (vertices: ArrayBufferView, size: number) => VertexBuffer;

    //#region Private Fields
    protected layout!: BufferLayout;
    //#endregion
}

export class IndexBuffer {
    constructor(indices: ArrayBufferView, count: number) {
        this.count = count;
    }

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }

    getCount(): number {
        return this.count;
    }

    static create: (indices: ArrayBufferView, size: number) => IndexBuffer;

    //#region Private Fields
    protected count: number = 0;
    //#endregion
}
