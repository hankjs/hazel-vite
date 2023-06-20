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
    gl,
} from "@pw/Hazel/Platform/Renderer/WebGL2/gl";

import {
    WebAppWindow as AppWindowImpl,
    type WindowProps,
} from "./WebAppWindow";
import { WebLoop } from "./WebLoop";
import { WebInput } from "./WebInput";

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

        this.vertexBuffer.setLayout(BufferLayout.create([
            new BufferElement(ShaderDataType.Float3, "a_Position"),
            new BufferElement(ShaderDataType.Float4, "a_Color"),
        ]));
        this.vertexArray.addVertexBuffer(this.vertexBuffer);

        const indices = new Uint16Array([0, 1, 2]);
        this.indexBuffer = IndexBuffer.create(indices, indices.length);
        this.vertexArray.addIndexBuffer(this.indexBuffer);

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
    }

    run(): void {
        console.log("[Application] Hazel Application running...");
        this.#running = true;
        this.#loop.while(
            () => {
                gl.clearColor(0.1, 0.1, 0.1, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);

                this.shader.bind();
                this.vertexArray.bind()

                gl.drawElements(
                    gl.TRIANGLES,
                    this.indexBuffer.getCount(),
                    gl.UNSIGNED_SHORT,
                    0,
                );

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

    //#endregion
}
