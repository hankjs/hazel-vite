import {
    type AppWindow,
    Application as _Application,
} from "@pw/Hazel/Hazel";
import { AppWindow as AppWindowImpl, type WindowProps } from "./AppWindow";
import { Loop } from "./Loop";
import { gl } from "./GLContext";

export class Application extends _Application {
    constructor(props: WindowProps) {
        super(props)
        this.#appWindow = AppWindowImpl.create(props);
        this.#appWindow.setEventCallback(this.onEvent.bind(this))
    }

    run(): void {
        console.log("Hazel Application running...");
        this.#loop.while(() => {
            gl.clearColor(0.1, 0.1, 0.1, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            this.#appWindow.onUpdate();
        })
    }

    // #region Private Fields
    #appWindow: AppWindow;
    #running: boolean = true;
    #loop: Loop = Loop.create();
    //#endregion
}
