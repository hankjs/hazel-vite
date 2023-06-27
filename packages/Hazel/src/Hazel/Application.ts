import { Clock } from "@hazel/share";
import { AppWindow, type WindowProps } from "./AppWindow";
import type {
    HazelEvent,
} from "./Events";
import type { Layer } from "./Layer";
import { LayerStack } from "./LayerStack";
import { Renderer } from "./Renderer";
import { GuiLayer } from "./Gui";

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
        setApp(this);

        this.appWindow = AppWindow.create(props);
        this.appWindow.setEventCallback(this.onEvent.bind(this));
        this.clock = new Clock();
        this.minimized = false;

        Renderer.init()

        this.layerStack = new LayerStack();

        this.pushLayer(new GuiLayer());
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
    onEvent(event: HazelEvent) {
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
    protected clock: Clock;
    protected minimized: boolean;
    //#endregion
}
