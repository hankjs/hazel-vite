import {
    type AppWindow,
    Application as _Application,
} from "@pw/Hazel/Hazel";
import { AppWindow as AppWindowImpl, type WindowProps } from "./AppWindow";
import { Loop } from "./Loop";

export class Application extends _Application {
    constructor(props: WindowProps) {
        super(props)
        this.#appWindow = AppWindowImpl.create(props);
        this.#appWindow.setEventCallback(this.onEvent.bind(this))
    }

    run(): void {
        console.log("Hazel Application running...");
        this.#loop.while(() => {
            this.#appWindow.onUpdate();
        })
    }

    // #region Private Fields
    #appWindow: AppWindow;
    #running: boolean = true;
    #loop: Loop = Loop.create();
    //#endregion
}
