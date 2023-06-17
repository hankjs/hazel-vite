import type { WindowProps } from "./AppWindow";
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

/**
 * Hazel export Application is Platform Implemented.
 * here is the interface for the Application class.
 */
export abstract class Application {
    constructor(props: WindowProps) {}
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
}
