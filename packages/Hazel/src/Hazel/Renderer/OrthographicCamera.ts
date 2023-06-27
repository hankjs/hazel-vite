import { vec3, mat4, glMatrix } from "gl-matrix";

export class OrthographicCamera {
    constructor(left: number, right: number, bottom: number, top: number) {
        // prettier-ignore
        this.#projectionMatrix = mat4.ortho(
            mat4.create(),
            left, right, bottom, top,
            -1.0,
            1.0,
        );
        this.#viewMatrix = mat4.create();
        this.#viewProjectionMatrix = mat4.mul(
            mat4.create(),
            this.#projectionMatrix,
            this.#viewMatrix,
        );
        this.#position = vec3.create();
        this.#rotation = 0.0;

        this.calculateViewMatrix();
    }

    getPosition() {
        return this.#position;
    }

    setPosition(v3: vec3 | [x: number, y: number, z: number]): void {
        const [x, y, z] = v3;
        this.#position = vec3.fromValues(x, y, z);
        this.calculateViewMatrix();
    }

    getRotation(): number {
        return this.#rotation;
    }

    setRotation(rotation: number): void {
        this.#rotation = rotation;
        this.calculateViewMatrix();
    }

    getProjection(): mat4 {
        return this.#projectionMatrix;
    }

    setProjection(
        left: number,
        right: number,
        bottom: number,
        top: number,
    ): void {
        // prettier-ignore
        this.#projectionMatrix = mat4.ortho(
            mat4.create(),
            left, right, bottom, top,
            -1.0,
            1.0,
        );
        this.#viewProjectionMatrix = mat4.mul(
            mat4.create(),
            this.#projectionMatrix,
            this.#viewMatrix,
        );
    }

    getView(): mat4 {
        return this.#viewMatrix;
    }

    getViewProjection(): mat4 {
        return this.#viewProjectionMatrix;
    }

    //#region Private Methods
    private calculateViewMatrix(): void {
        const transform = mat4.create();
        mat4.translate(transform, transform, this.#position);
        mat4.rotateZ(transform, transform, glMatrix.toRadian(this.#rotation));

        this.#viewMatrix = mat4.invert(mat4.create(), transform);
        this.#viewProjectionMatrix = mat4.mul(
            mat4.create(),
            this.#projectionMatrix,
            this.#viewMatrix,
        );
    }
    //#endregion

    //#region Private Fields
    #projectionMatrix!: mat4;
    #viewMatrix!: mat4;
    #viewProjectionMatrix!: mat4;
    #position!: vec3;
    #rotation!: number;
    //#endregion
}
