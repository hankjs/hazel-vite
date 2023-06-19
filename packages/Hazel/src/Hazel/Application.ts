import type { AppWindow, WindowProps } from "./AppWindow";
import type {
    AppRenderEvent,
    AppTickEvent,
    AppUpdateEvent,
    Event,
    KeyEvent,
    KeyPressedEvent,
    KeyReleasedEvent,
    KeyTypedEvent,
    MouseButtonEvent,
    MouseButtonPressedEvent,
    MouseButtonReleasedEvent,
    MouseMovedEvent,
    MouseScrolledEvent,
    WindowCloseEvent,
    WindowResizeEvent,
} from "./Events";
import type { Layer } from "./Layer";
import { LayerStack } from "./LayerStack";
import { Shader } from "./Renderer";

let app: Application;

export function setApp(instance: Application) {
    app = instance;
}
/**
 * Hazel export Application is Platform Implemented.
 * here is the interface for the Application class.
 */
export abstract class Application {
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
    ) {
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
    protected vertexArray!: number;
    protected vertexBuffer!: number;
    protected indexBuffer!: number;
    protected shader!: Shader;
    //#endregion
}
