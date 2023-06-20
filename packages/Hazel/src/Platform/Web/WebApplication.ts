//#region Hazel
import { Event } from "@pw/Hazel/Hazel/Events/Event";
import {
    KeyEvent,
    KeyPressedEvent,
    KeyReleasedEvent,
    KeyTypedEvent,
} from "@pw/Hazel/Hazel/Events/KeyEvent";
import {
    MouseButtonEvent,
    MouseButtonPressedEvent,
    MouseButtonReleasedEvent,
    MouseMovedEvent,
    MouseScrolledEvent,
} from "@pw/Hazel/Hazel/Events/MouseEvent";
import {
    WindowCloseEvent,
    WindowResizeEvent,
} from "@pw/Hazel/Hazel/Events/ApplicationEvent";
import {
    AppRenderEvent,
    AppTickEvent,
    AppUpdateEvent,
} from "@pw/Hazel/Hazel/Events/ApplicationEvent";
import { Application as _Application } from "@pw/Hazel/Hazel/Application";
import { Shader } from "@pw/Hazel/Hazel/Renderer/Shader";
import {
    BufferElement,
    BufferLayout,
    IndexBuffer,
    ShaderDataType,
    VertexBuffer,
} from "@pw/Hazel/Hazel/Renderer/Buffer";
import { VertexArray } from "@pw/Hazel/Hazel/Renderer/VertexArray";
//#endregion

import {
    WebAppWindow as AppWindowImpl,
    type WindowProps,
} from "./WebAppWindow";
import { WebLoop } from "./WebLoop";
import { WebInput } from "./WebInput";
import { RenderCommand } from "@pw/Hazel/Hazel/Renderer/RenderCommand";
import { Renderer } from "@pw/Hazel/Hazel/Renderer/Renderer";

export class WebApplication extends _Application {
    static getInstance(): _Application {
        return _Application.getInstance();
    }

    constructor(props: WindowProps) {
        super(props);
        this.appWindow = AppWindowImpl.create(props);
        this.appWindow.setEventCallback(this.onEvent.bind(this));
        this.#input = WebInput.create();

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
                new BufferElement(ShaderDataType.Float3, "a_Position"),
                new BufferElement(ShaderDataType.Float4, "a_Color"),
            ]),
        );
        this.vertexArray.addVertexBuffer(this.vertexBuffer);

        const indices = new Uint32Array([0, 1, 2]);
        this.indexBuffer = IndexBuffer.create(indices, indices.length);
        this.vertexArray.addIndexBuffer(this.indexBuffer);

        this.squareVA = VertexArray.create();

        // prettier-ignore
        const squareVertices= new Float32Array([
            -0.75, -0.75, 0.0,
             0.75, -0.75, 0.0,
             0.75,  0.75, 0.0,
            -0.75,  0.75, 0.0,
        ]);

        this.squareVB = VertexBuffer.create(
            squareVertices,
            squareVertices.length,
        );

        this.squareVB.setLayout(
            BufferLayout.create([
                new BufferElement(ShaderDataType.Float3, "a_Position"),
            ]),
        );
        this.squareVA.addVertexBuffer(this.squareVB);

        const squareIndices = new Uint32Array([0, 1, 2, 2, 3, 0]);
        this.squareIB = IndexBuffer.create(squareIndices, squareIndices.length);
        this.squareVA.addIndexBuffer(this.squareIB);

        const vertexSrc = `#version 300 es
            precision highp float;
			
			layout(location = 0) in vec3 a_Position;
			layout(location = 1) in vec4 a_Colot;

			out vec3 v_Position;
			out vec4 v_Color;

			void main()
			{
				v_Position = a_Position;
                v_Color = a_Colot;
				gl_Position = vec4(a_Position, 1.0);	
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

        const squareVertexSrc = `#version 300 es
            precision highp float;
            
            layout(location = 0) in vec3 a_Position;

            out vec3 v_Position;

            void main()
            {
                v_Position = a_Position;
                gl_Position = vec4(a_Position, 1.0);	
            }
        `;

        const squareFragmentSrc = `#version 300 es
            precision highp float;
            
            out vec4 color;

            in vec3 v_Position;

            void main()
            {
                color = vec4(v_Position * 0.5 + 0.5, 1.0);
            }
        `;

        this.squareShader = Shader.create(squareVertexSrc, squareFragmentSrc);
    }

    run(): void {
        console.log("[Application] Hazel Application running...");
        this.#running = true;
        this.#loop.while(
            () => {
                RenderCommand.setClearColor([0.1, 0.1, 0.1, 1]);
                RenderCommand.clear();

                Renderer.beginScene()
                this.squareShader.bind();
                Renderer.submit(this.squareVA);

                this.shader.bind();
                Renderer.submit(this.vertexArray);

                Renderer.endScene()

                for (const layer of this.layerStack) {
                    layer.onUpdate();
                }

                this.appWindow.onUpdate();
            },
            () => (this.#running = false),
        );
    }

    onEvent(
        event:
            | Event
            | WindowResizeEvent
            | WindowCloseEvent
            | AppTickEvent
            | AppUpdateEvent
            | AppRenderEvent
            | KeyEvent
            | KeyPressedEvent
            | KeyReleasedEvent
            | KeyTypedEvent
            | MouseMovedEvent
            | MouseScrolledEvent
            | MouseButtonEvent
            | MouseButtonPressedEvent
            | MouseButtonReleasedEvent,
    ): void {
        for (const layer of this.layerStack) {
            layer.onEvent(event);
            if (event.handled) {
                break;
            }
        }
    }

    // #region Private Fields
    #input: WebInput;
    #running: boolean = true;
    #loop: WebLoop = WebLoop.create();

    squareShader: Shader;
    squareIB!: IndexBuffer;
    squareVA: VertexArray;
    squareVB: VertexBuffer;
    //#endregion
}
