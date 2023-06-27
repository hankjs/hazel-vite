//#region Hazel
import {
    EventDispatcher,
    HazelEvent,
    WindowResizeEvent,
} from "@pw/Hazel/Hazel/Events";
import { Application } from "@pw/Hazel/Hazel/Application";
//#endregion

import { type WindowProps } from "./WebAppWindow";
import { WebLoop } from "./WebLoop";
import { WebInput } from "./WebInput";
import { Renderer } from "@pw/Hazel/Hazel";

export class WebApplication extends Application {
    static getInstance(): Application {
        return Application.getInstance();
    }

    constructor(props: WindowProps) {
        super(props);
        this.#input = WebInput.create();
    }

    run(): void {
        console.log("[Application] Hazel Application running...");
        this.#running = true;
        this.#loop.while(() => {
            const ts = this.clock.getDeltaSecond();

            if (!this.minimized) {
                for (const layer of this.layerStack) {
                    layer.onUpdate(ts);
                }
            }

            this.appWindow.onUpdate(ts);
            return this.#running;
        });
    }

    onEvent(event: HazelEvent): void {
        const dispatcher = new EventDispatcher(event);
        for (const layer of this.layerStack) {
            layer.onEvent(event);
            if (event.handled) {
                break;
            }
        }

        dispatcher.dispatch(WindowResizeEvent, this.onWindowResize.bind(this));
    }

    onWindowResize(event: WindowResizeEvent): boolean {
        if (event.getWidth() === 0 || event.getHeight() === 0) {
            this.minimized = true;
            return false;
        }

        this.minimized = false;

        Renderer.onWindowResize(event.getWidth(), event.getHeight());

        return false;
    }

    // #region Private Fields

    #input: WebInput;
    #running: boolean = true;
    #loop: WebLoop = WebLoop.create();

    //#endregion
}
