import type { Window as _Window } from "./Window";
import { Window } from "@Hazel/Plarform";

export abstract class Application {
    constructor() {
        this.window = Window.create();
    }
    run(): void {
        console.log("Hazel Application running...");
    }

    // #region Private Fields
    window: _Window;
    running: boolean = true;
}
