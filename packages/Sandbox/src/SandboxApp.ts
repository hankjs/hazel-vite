import {
    Layer,
    HazelEvent,
    Application,
    type WindowProps,
    GuiLayer,
    BufferElement,
    BufferLayout,
    ShaderDataType,
    IndexBuffer,
    VertexBuffer,
    VertexArray,
    RenderCommand,
    Renderer,
    OrthographicCamera,
    Texture2D,
    ShaderLibrary,
    OrthographicCameraController,
    WindowResizeEvent,
} from "@hazel/hazel";
import { mat4, vec3 } from "gl-matrix";
import { CheckerboardPng, ChernoLogoPng } from "./assets/textures";
import { FlatColorGLSL, ShaderGLSL, TextureGLSL } from "./assets/shaders";

class WebGL2Layer extends Layer {
    constructor(name: string = "WebGL2") {
        super(name);
        this.cameraController = new OrthographicCameraController(window.innerWidth / window.innerHeight);
        this.shaderLibrary = new ShaderLibrary();

        //#region Triangle
        this.vertexArray = VertexArray.create();
        this.vertexArray.bind();

        // prettier-ignore
        const vertices= new Float32Array([
			-0.5, -0.5, 0.0, 0.8, 0.2, 0.8, 1.0,
			 0.5, -0.5, 0.0, 0.2, 0.3, 0.8, 1.0,
			 0.0,  0.5, 0.0, 0.8, 0.8, 0.2, 1.0,
		]);

        this.vertexBuffer = VertexBuffer.create(vertices, vertices.byteLength);

        this.vertexBuffer.setLayout(
            BufferLayout.create([
                BufferElement.create(ShaderDataType.Float3, "a_Position"),
                BufferElement.create(ShaderDataType.Float4, "a_Color"),
            ]),
        );
        this.vertexArray.addVertexBuffer(this.vertexBuffer);

        const indices = new Uint32Array([0, 1, 2]);
        this.indexBuffer = IndexBuffer.create(indices, indices.length);
        this.vertexArray.addIndexBuffer(this.indexBuffer);

        this.shaderLibrary.load("shader", ShaderGLSL);
        //#endregion

        //#region flatColor
        this.flatColorVA = VertexArray.create();

        // prettier-ignore
        const flatColorVertices= new Float32Array([
            -0.5, -0.5, 0.0, 0.0, 0.0,
             0.5, -0.5, 0.0, 1.0, 0.0,
             0.5,  0.5, 0.0, 1.0, 1.0,
            -0.5,  0.5, 0.0, 0.0, 1.0,
        ]);

        this.flatColorVB = VertexBuffer.create(
            flatColorVertices,
            flatColorVertices.length,
        );

        this.flatColorVB.setLayout(
            BufferLayout.create([
                BufferElement.create(ShaderDataType.Float3, "a_Position"),
                BufferElement.create(ShaderDataType.Float2, "a_TexCoord"),
            ]),
        );
        this.flatColorVA.addVertexBuffer(this.flatColorVB);

        const flatColorIndices = new Uint32Array([0, 1, 2, 2, 3, 0]);
        this.flatColorIB = IndexBuffer.create(
            flatColorIndices,
            flatColorIndices.length,
        );
        this.flatColorVA.addIndexBuffer(this.flatColorIB);
        this.shaderLibrary.load("flatColor", FlatColorGLSL);
        //#endregion

        //#region Texture
        const textureShader = this.shaderLibrary.load("texture", TextureGLSL);

        this.texture = Texture2D.create(CheckerboardPng);
        this.chernoLogoTexture = Texture2D.create(ChernoLogoPng);

        textureShader.bind();
        textureShader.uploadUniformInt("u_Texture", 0);
        //#endregion

        //#region Debug GUI
        GuiLayer.begin("Square");
        GuiLayer.addColor(this, "squareColor");

        GuiLayer.end();
        //#endregion
    }

    onAttach(): void {}

    onDetach(): void {}

    onUpdate(ts: number): void {
        this.cameraController.onUpdate(ts);

        RenderCommand.setClearColor([0.1, 0.1, 0.1, 1]);
        RenderCommand.clear();

        Renderer.beginScene(this.cameraController.getCamera());

        const scale = mat4.scale(mat4.create(), mat4.create(), [0.1, 0.1, 0.1]);
        const originTransform = mat4.translate(
            mat4.create(),
            mat4.create(),
            vec3.fromValues(-1, -1, 0.0),
        );

        const flatColorShader = this.shaderLibrary.get("flatColor");
        flatColorShader.bind();
        flatColorShader.uploadUniformFloat3("u_Color", this.squareColor);

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const pos = vec3.fromValues(x * 0.11, y * 0.11, 0);
                const transform = mat4.translate(
                    mat4.create(),
                    originTransform,
                    pos,
                );
                Renderer.submit(
                    flatColorShader,
                    this.flatColorVA,
                    mat4.mul(mat4.create(), transform, scale),
                );
            }
        }
        const textureShader = this.shaderLibrary.get("texture");

        this.texture.bind();
        Renderer.submit(
            textureShader,
            this.flatColorVA,
        );
        this.chernoLogoTexture.bind();
        Renderer.submit(
            textureShader,
            this.flatColorVA,
        );

        // const shader = this.shaderLibrary.get("shader");
        // Renderer.submit(this.shader, this.vertexArray);

        Renderer.endScene();
    }

    onEvent(event: HazelEvent): void {
        this.cameraController.onEvent(event);
    }

    // #region Private Fields
    shaderLibrary!: ShaderLibrary;

    vertexArray!: VertexArray;
    vertexBuffer!: VertexBuffer;
    indexBuffer!: IndexBuffer;

    flatColorIB!: IndexBuffer;
    flatColorVA!: VertexArray;
    flatColorVB!: VertexBuffer;

    texture!: Texture2D;
    chernoLogoTexture!: Texture2D;

    camera = new OrthographicCamera(-2, 2, -2, 2);
    cameraController!: OrthographicCameraController;

    squareColor: [number, number, number] = [0.2, 0.3, 0.8];
    //#endregion
}

export class SandboxApp extends Application {
    constructor(props: WindowProps) {
        super(props);
        this.pushLayer(new WebGL2Layer());
    }
}
