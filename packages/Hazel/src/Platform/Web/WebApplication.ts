//#region Hazel
import { HazelEvent } from "@pw/Hazel/Hazel/Events";
import { Application } from "@pw/Hazel/Hazel/Application";
//#endregion

import { type WindowProps } from "./WebAppWindow";
import { WebLoop } from "./WebLoop";
import { WebInput } from "./WebInput";

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
        this.#loop.while(
            () => {
                const ts = this.clock.getDeltaSecond()
                for (const layer of this.layerStack) {
                    layer.onUpdate(ts);
                }

                this.appWindow.onUpdate(ts);
            },
            () => (this.#running = false),
        );
    }

    onEvent(event: HazelEvent): void {
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
