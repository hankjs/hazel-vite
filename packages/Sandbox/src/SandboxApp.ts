import { Layer, Event, EventType, KeyEvent, Application, type WindowProps, DatGuiLayer } from "@hazel/hazel";
import { KeyCodes } from "@hazel/share";

class ExampleLayer extends Layer {
    constructor(name: string = "Example") {
        super(name);
    }

    onAttach(): void {}
    onDetach(): void {}
    onUpdate(): void {}

    onEvent(event: Event): void {
        if (event.getType() === EventType.KeyPressed) {
            const e = event as KeyEvent;
            if (e.getKeyCode() === KeyCodes.KeyS) {
                console.info("KeyS key is pressed (event)!");
            }
        }
    }
}

export class SandboxApp extends Application {
    constructor(props: WindowProps) {
        super(props);
        this.pushLayer(new ExampleLayer());
        this.pushLayer(new DatGuiLayer());
    }

}
