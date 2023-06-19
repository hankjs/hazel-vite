import { GraphicsContext as _GraphicsContext } from "@pw/Hazel/Hazel/Renderer";
import { setGL } from "./gl";

export class WebGL2GraphicsContext extends _GraphicsContext<HTMLCanvasElement> {
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
                "[Renderer] Failed to initialize WebGLContext: webgl2 not supports.",
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
