import {
    Layer,
    Event,
    EventType,
    Application,
    type WindowProps,
    DatGuiLayer,
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
} from "@hazel/hazel";
import { KeyCodes } from "@hazel/share";
import { mat4, vec3 } from "gl-matrix";

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

        //#region Square
        this.squareVA = VertexArray.create();

        // prettier-ignore
        const squareVertices= new Float32Array([
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5,  0.5, 0.0,
        ]);

        this.squareVB = VertexBuffer.create(
            squareVertices,
            squareVertices.length,
        );

        this.squareVB.setLayout(
            BufferLayout.create([
                BufferElement.create(ShaderDataType.Float3, "a_Position"),
            ]),
        );
        this.squareVA.addVertexBuffer(this.squareVB);

        const squareIndices = new Uint32Array([0, 1, 2, 2, 3, 0]);
        this.squareIB = IndexBuffer.create(squareIndices, squareIndices.length);
        this.squareVA.addIndexBuffer(this.squareIB);
        const squareVertexSrc = `#version 300 es
            precision mediump float;
            
            layout(location = 0) in vec3 a_Position;

            uniform mat4 u_ViewProjection;
            uniform mat4 u_Transform;

            void main()
            {
                gl_Position = u_ViewProjection * u_Transform * vec4(a_Position, 1.0);	
            }
        `;

        const squareFragmentSrc = `#version 300 es
            precision mediump float;
            
            out vec4 color;

            void main()
            {
                color = vec4(0, 0, 0.8, 1.0);
            }
        `;

        this.squarePosition = vec3.fromValues(-1, -1, 0.0);
        this.squareShader = Shader.create(squareVertexSrc, squareFragmentSrc);
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

        //#region Square Transform
        if (Input.isKeyPressed(KeyCodes.KeyJ)) {
            this.squarePosition[0] -= this.squareMoveSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.KeyL)) {
            this.squarePosition[0] += this.squareMoveSpeed * ts;
        }

        if (Input.isKeyPressed(KeyCodes.KeyI)) {
            this.squarePosition[1] += this.squareMoveSpeed * ts;
        } else if (Input.isKeyPressed(KeyCodes.KeyK)) {
            this.squarePosition[1] -= this.squareMoveSpeed * ts;
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
            this.squarePosition,
        );

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const pos = vec3.fromValues(x * 0.11, y * 0.11, 0);
                const transform = mat4.translate(
                    mat4.create(),
                    originTransform,
                    pos,
                );
                Renderer.submit(
                    this.squareShader,
                    this.squareVA,
                    mat4.mul(mat4.create(), transform, scale),
                );
            }
        }

        Renderer.submit(this.shader, this.vertexArray);

        Renderer.endScene();
    }

    onEvent(event: Event): void {
        if (event.getType() === EventType.WindowResize) {
            const resizeEvent = event as WindowResizeEvent;
            Renderer.setViewport(
                0,
                0,
                resizeEvent.getWidth(),
                resizeEvent.getHeight(),
            );
        }

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
    squareShader!: Shader;
    squareIB!: IndexBuffer;
    squareVA!: VertexArray;
    squareVB!: VertexBuffer;

    camera = new OrthographicCamera(-2, 2, -2, 2);
    cameraPosition = vec3.create();
    cameraRotation = 0;
    cameraMoveSpeed = 1;
    cameraRotationSpeed = 180;

    squarePosition = vec3.create();
    squareMoveSpeed = 1;
    //#endregion
}

export class SandboxApp extends Application {
    constructor(props: WindowProps) {
        super(props);
        this.pushLayer(new WebGL2Layer());
        this.pushLayer(new DatGuiLayer());
    }
}
