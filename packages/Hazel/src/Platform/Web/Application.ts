import {
    Application as _Application,
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
} from "@pw/Hazel/Hazel";
import { AppWindow as AppWindowImpl, type WindowProps } from "./AppWindow";
import { Loop } from "./Loop";
import { gl } from "./GLContext";
import { Input } from "./Input";

export class Application extends _Application {
    static getInstance(): _Application {
        return _Application.getInstance()
    }

    constructor(props: WindowProps) {
        super(props);
        this.appWindow = AppWindowImpl.create(props);
        this.appWindow.setEventCallback(this.onEvent.bind(this));
        this.#input = Input.create()
    }

    run(): void {
        console.log("Hazel Application running...");
        this.#running = true;
        this.#loop.while(
            () => {
                gl.clearColor(0.1, 0.1, 0.1, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);

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
    #input: Input;
    #running: boolean = true;
    #loop: Loop = Loop.create();
    //#endregion
}
