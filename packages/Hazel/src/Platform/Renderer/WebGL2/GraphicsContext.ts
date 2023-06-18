import { GraphicsContext as _GraphicsContext } from "@pw/Hazel/Hazel/Renderer";

export let gl: WebGL2RenderingContext;

function setGL(context: WebGL2RenderingContext) {
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

export class GraphicsContext extends _GraphicsContext<HTMLCanvasElement> {
    constructor(canvas?: HTMLElement) {
        if (!canvas || canvas.tagName !== "CANVAS") {
            canvas = document.createElement("canvas");
        }
        super(canvas as HTMLCanvasElement);
    }

    init() {
        const context = this.container.getContext("webgl2");
        if (!context) {
            throw new Error(
                "Failed to initialize WebGLContext: webgl2 not supports.",
            );
        }
        setGL(context);
        this.#context = context;

        console.info("[Renderer] WebGL2 Info:");
        console.info("  Vendor:    ", context.VENDOR);
        console.info("  Renderer:  ", context.RENDERER);
        console.info("  Version:   ", context.VERSION);
    }

    getContext() {
        return this.#context;
    }
    getContainer() {
        return this.container;
    }

    #context: WebGL2RenderingContext | null = null;
}
