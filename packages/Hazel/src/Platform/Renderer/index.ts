import * as Hazel from "@pw/Hazel/Hazel";

const RENDERER = import.meta.env.VITE_RENDERER;

let modules: any;

console.log(`[Core] Hazel init Renderer: ${RENDERER}`);
if (RENDERER === "WebGL2") {
    modules = import.meta.glob(`./WebGL2/*.ts`, { eager: true });
} else {
    throw new Error(`Unsupported renderer: ${RENDERER}`);
}

/** Type */
class GraphicsContextIpml extends Hazel.GraphicsContext {}
export const GraphicsContext = modules[`./${RENDERER}/GraphicsContext.ts`]
    .GraphicsContext as typeof GraphicsContextIpml;
