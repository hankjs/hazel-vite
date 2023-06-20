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
//#endregion

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
    }

    run(): void {
        console.log("[Application] Hazel Application running...");
        this.#running = true;
        this.#loop.while(
            () => {
                for (const layer of this.layerStack) {
                    layer.onUpdate();
                }

                this.appWindow.onUpdate();
            },
            () => (this.#running = false),
        );
    }

    onEvent(event: Event): void {
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
