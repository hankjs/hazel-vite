import {
    Layer,
    Event,
    EventType,
    Application,
    type WindowProps,
    GuiLayer,
    BufferElement,
    BufferLayout,
    ShaderDataType,
    IndexBuffer,
    VertexBuffer,
    VertexArray,
    Shader,
    RenderCommand,
    Renderer,
    OrthographicCamera,
    WindowResizeEvent,
    EventDispatcher,
    KeyPressedEvent,
    KeyEvent,
    Input,
    Texture2D
} from "@hazel/hazel";
import { KeyCodes } from "@hazel/share";
import { mat4, vec3, vec4 } from "gl-matrix";
import { CheckerboardPng, ChernoLogoPng } from "./assets/textures";

class WebGL2Layer extends Layer {
    constructor(name: string = "WebGL2") {
        super(name);
    }

    onAttach(): void {
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

        const vertexSrc = `#version 300 es
            precision highp float;
			
			layout(location = 0) in vec3 a_Position;
			layout(location = 1) in vec4 a_Colot;

            uniform mat4 u_ViewProjection;
            uniform mat4 u_Transform;

			out vec3 v_Position;
			out vec4 v_Color;

			void main()
			{
				v_Position = a_Position;
                v_Color = a_Colot;
				gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);	
			}
		`;

        const fragmentSrc = `#version 300 es
            precision highp float;
			
			out vec4 color;

			in vec3 v_Position;
			in vec4 v_Color;

			void main()
			{
				color = vec4(v_Position * 0.5 + 0.5, 1.0);
                color = v_Color;
			}
		`;

        this.shader = Shader.create(vertexSrc, fragmentSrc);
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
        const flatColorVertexSrc = `#version 300 es
            precision mediump float;
            
            layout(location = 0) in vec3 a_Position;

            uniform mat4 u_ViewProjection;
            uniform mat4 u_Transform;

            void main()
            {
                gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);	
            }
        `;

        const flatColorFragmentSrc = `#version 300 es
            precision mediump float;
            
            out vec4 color;

            uniform vec3 u_Color;

            void main()
            {
                color = vec4(u_Color, 1.0);
            }
        `;

        this.flatColorShader = Shader.create(
            flatColorVertexSrc,
            flatColorFragmentSrc,
        );
        this.flatColorPosition = vec3.fromValues(-1, -1, 0.0);
        //#endregion
        
        //#region Texture
        const textureVertexSrc = `#version 300 es
        precision mediump float;
        
        layout(location = 0) in vec3 a_Position;
        layout(location = 1) in vec2 a_TexCoord;

        uniform mat4 u_ViewProjection;
        uniform mat4 u_Transform;

        out vec2 v_TexCoord;

        void main()
        {
            v_TexCoord = a_TexCoord;
            gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);	
        }
    `;

        const textureFragmentSrc = `#version 300 es
        precision mediump float;
        
        out vec4 color;

        in vec2 v_TexCoord;

        uniform sampler2D u_Texture;

        void main()
        {
            color = texture(u_Texture, v_TexCoord);
        }
    `;
        this.textureShader = Shader.create(
            textureVertexSrc,
            textureFragmentSrc,
        );

        this.texture = Texture2D.create(CheckerboardPng);
        this.chernoLogoTexture = Texture2D.create(ChernoLogoPng);

        this.textureShader.bind();
        this.textureShader.uploadUniformInt("u_Texture", 0);
        //#endregion

        //#region Debug GUI
        GuiLayer.begin("Square");
        GuiLayer.addColor(this, "squareColor");

        GuiLayer.end();
        //#endregion
    }
    onDetach(): void {}
    onUpdate(ts: number): void {
        //#region Camera Control
        if (Input.isKeyPressed(KeyCodes.ArrowLeft)) {
            this.cameraPosition[0] += this.cameraMoveSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.ArrowRight)) {
            this.cameraPosition[0] -= this.cameraMoveSpeed * ts;
        }

        if (Input.isKeyPressed(KeyCodes.ArrowUp)) {
            this.cameraPosition[1] -= this.cameraMoveSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.ArrowDown)) {
            this.cameraPosition[1] += this.cameraMoveSpeed * ts;
        }

        if (Input.isKeyPressed(KeyCodes.KeyA)) {
            this.cameraRotation -= this.cameraRotationSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.KeyD)) {
            this.cameraRotation += this.cameraRotationSpeed * ts;
        }
        //#endregion

        //#region flatColor Transform
        if (Input.isKeyPressed(KeyCodes.KeyJ)) {
            this.flatColorPosition[0] -= this.flatColorMoveSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.KeyL)) {
            this.flatColorPosition[0] += this.flatColorMoveSpeed * ts;
        }

        if (Input.isKeyPressed(KeyCodes.KeyI)) {
            this.flatColorPosition[1] += this.flatColorMoveSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.KeyK)) {
            this.flatColorPosition[1] -= this.flatColorMoveSpeed * ts;
        }
        //#endregion

        RenderCommand.setClearColor([0.1, 0.1, 0.1, 1]);
        RenderCommand.clear();

        this.camera.setPosition(this.cameraPosition);
        this.camera.setRotation(this.cameraRotation);

        Renderer.beginScene(this.camera);

        const scale = mat4.scale(mat4.create(), mat4.create(), [0.1, 0.1, 0.1]);
        const originTransform = mat4.translate(
            mat4.create(),
            mat4.create(),
            this.flatColorPosition,
        );

        this.flatColorShader.bind();
        this.flatColorShader.uploadUniformFloat3("u_Color", this.squareColor);

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const pos = vec3.fromValues(x * 0.11, y * 0.11, 0);
                const transform = mat4.translate(
                    mat4.create(),
                    originTransform,
                    pos,
                );
                Renderer.submit(
                    this.flatColorShader,
                    this.flatColorVA,
                    mat4.mul(mat4.create(), transform, scale),
                );
            }
        }

        this.texture.bind()
        Renderer.submit(this.textureShader, this.flatColorVA, mat4.scale(mat4.create(), mat4.create(), [1.5, 1.5, 1.5]));
        this.chernoLogoTexture.bind()
        Renderer.submit(this.textureShader, this.flatColorVA, mat4.scale(mat4.create(), mat4.create(), [1.5, 1.5, 1.5]));

        // Renderer.submit(this.shader, this.vertexArray);

        Renderer.endScene();
    }

    onEvent(event: Event): void {
        const dispatcher = new EventDispatcher(event);
        dispatcher.dispatch(KeyPressedEvent, this.onKeyPressedEvent.bind(this));
    }

    onKeyPressedEvent(event: KeyPressedEvent) {
        return false;
    }

    // #region Private Fields
    vertexArray!: VertexArray;
    vertexBuffer!: VertexBuffer;
    indexBuffer!: IndexBuffer;
    shader!: Shader;
    flatColorShader!: Shader;
    flatColorIB!: IndexBuffer;
    flatColorVA!: VertexArray;
    flatColorVB!: VertexBuffer;

    textureShader!: Shader;
    texture!: Texture2D;
    chernoLogoTexture!: Texture2D;

    camera = new OrthographicCamera(-2, 2, -2, 2);
    cameraPosition = vec3.create();
    cameraRotation = 0;
    cameraMoveSpeed = 1;
    cameraRotationSpeed = 180;

    flatColorPosition = vec3.create();
    flatColorMoveSpeed = 1;
    squareColor: [number, number, number] = [0.2, 0.3, 0.8];
    //#endregion
}

export class SandboxApp extends Application {
    constructor(props: WindowProps) {
        super(props);
        this.pushLayer(new WebGL2Layer());
    }
}
