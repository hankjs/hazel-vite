import type { AppWindow, WindowProps } from "./AppWindow";
import type {
    Event,
} from "./Events";
import type { Layer } from "./Layer";
import { LayerStack } from "./LayerStack";
import { Shader } from "./Renderer";
import type { IndexBuffer, VertexBuffer } from "./Renderer/Buffer";
import type { VertexArray } from "./Renderer/VertexArray";

let app: Application;

export function setApp(instance: Application) {
    app = instance;
}

/**
 * Hazel export Application is Platform Implemented.
 * here is the interface for the Application class.
 */
export class Application {
    constructor(props: WindowProps) {
        if (app) {
            throw new Error("Application already exists!");
        }
        this.layerStack = new LayerStack();
        setApp(this);
    }

    static getInstance(): Application {
        return app;
    }

    getAppWindow(): AppWindow {
        return this.appWindow;
    }

    // implements in Platform
    run(): void {
        throw new Error("Method not implemented.");
    }

    // implements in Client
    onEvent(event: Event) {
        throw new Error("Method not implemented.");
    }

    //#region Public Methods
    pushLayer(layer: Layer): void {
        this.layerStack.push(layer);
        layer.onAttach();
    }

    pushOverlay(layer: Layer): void {
        this.layerStack.push(layer);
        layer.onAttach();
    }
    //#endregion

    //#region Private Fields
    layerStack: LayerStack;
    // init in Platform
    protected appWindow!: AppWindow;
    //#endregion
}
