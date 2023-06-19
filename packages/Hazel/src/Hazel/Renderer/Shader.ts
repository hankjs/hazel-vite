export class Shader {
    constructor(vertexSource: string, fragmentSource: string) { }

    bind(): void {
        throw new Error("Method not implemented.");
    }
    unbind(): void {
        throw new Error("Method not implemented.");
    }

    static create: (vertexSource: string, fragmentSource: string) => Shader 
}
