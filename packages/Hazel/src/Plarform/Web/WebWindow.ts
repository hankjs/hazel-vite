import { listenElementRemove } from "@hazel/share";
import {
    WindowCloseEvent,
    WindowResizeEvent,
} from "@Hazel/Hazel/Events/ApplicationEvent";
import {
    KeyPressedEvent,
    KeyReleasedEvent,
    KeyTypedEvent,
} from "@Hazel/Hazel/Events/KeyEvent";
import {
    MouseButtonPressedEvent,
    MouseButtonReleasedEvent,
    MouseMovedEvent,
    MouseScrolledEvent,
} from "@Hazel/Hazel/Events/MouseEvent";
import {
    Window,
    type EventCallBackFn,
    type WindowProps,
} from "@Hazel/Hazel/Window";

type Props = WindowProps<HTMLElement>;

const defaultProps = (): Props => ({
    title: "Hazel",
    width: 300,
    height: 300,
});
const noop = () => {};

export class WebWindow extends Window {
    container: Element = document.body;
    isOutside = false;

    static create(props: Props = defaultProps()): Window {
        return new WebWindow(props);
    }

    getWidth(): number {
        return this.m_data.width;
    }

    getHeight(): number {
        return this.m_data.height;
    }

    constructor(props: Props) {
        super();
        this.init(props);
    }

    onUpdate(): void {}
    onAttach(): void {}
    onDetach(): void {}

    setVSync(enabled: boolean): void {
        this.m_data.VSync = enabled;
    }

    isVSync(): boolean {
        return this.m_data.VSync;
    }

    setEventCallback(callback: EventCallBackFn) {
        this.m_data.eventCallback = callback;
    }

    //#region Private Methods
    init(props: Props) {
        if (props.el) {
            this.container = props.el;
        }
        this.m_data.title = props.title;
        this.m_data.width = props.width;
        this.m_data.height = props.height;

        console.info(
            `Creating window ${props.title} ${props.width} ${props.height}`,
        );

        const resizeHandler = () => {
            const rect = this.container.getBoundingClientRect();
            const event = new WindowResizeEvent(rect.width, rect.height);
            this.m_data.eventCallback(event);
        };
        window.addEventListener("resize", resizeHandler);

        const keydownHandler = (event: KeyboardEvent) => {
            if (this.isOutside) return;
            this.m_data.eventCallback(
                new KeyPressedEvent(event.code, event.repeat),
            );
        };
        document.addEventListener("keydown", keydownHandler);

        const keypressHandler = (event: KeyboardEvent) => {
            if (this.isOutside) return;
            this.m_data.eventCallback(new KeyTypedEvent(event.code));
        };
        document.addEventListener("keypress", keypressHandler);

        const keyupHandler = (event: KeyboardEvent) => {
            if (this.isOutside) return;
            this.m_data.eventCallback(new KeyReleasedEvent(event.code));
        };
        document.addEventListener("keyup", keyupHandler);

        const mousedownHandler = (event: MouseEvent) => {
            if (this.isOutside) return;
            this.m_data.eventCallback(
                new MouseButtonPressedEvent(event.button),
            );
        };
        document.addEventListener("mousedown", mousedownHandler);

        const contextmenuHandler = (event: MouseEvent) => {
            if (this.isOutside) return;
            event.preventDefault();
            event.stopPropagation();
        };
        document.addEventListener("contextmenu", contextmenuHandler);

        const mouseupHandler = (event: MouseEvent) => {
            if (this.isOutside) return;
            this.m_data.eventCallback(
                new MouseButtonReleasedEvent(event.button),
            );
        };
        document.addEventListener("mouseup", mouseupHandler);

        const wheelHandler = (event: WheelEvent) => {
            if (this.isOutside) return;
            event.preventDefault();
            event.stopPropagation();
            this.m_data.eventCallback(
                new MouseScrolledEvent(event.deltaX, event.deltaY),
            );
        };
        document.addEventListener("wheel", wheelHandler, {
            passive: false,
        });

        const mousemoveHandler = (event: MouseEvent) => {
            const { left, top, width, height } =
                this.container.getBoundingClientRect();

            const elementPositionX = left + window.pageXOffset;
            const elementPositionY = top + window.pageYOffset;

            const elX = event.pageX - elementPositionX;
            const elY = event.pageY - elementPositionY;

            this.isOutside =
                width === 0 ||
                height === 0 ||
                elX < 0 ||
                elY < 0 ||
                elX > width ||
                elY > height;
            if (this.isOutside) return;
            this.m_data.eventCallback(new MouseMovedEvent(elX, elY));
        };
        document.addEventListener("mousemove", mousemoveHandler);

        listenElementRemove(this.container, () => {
            const event = new WindowCloseEvent();
            this.m_data.eventCallback(event);

            window.removeEventListener("resize", resizeHandler);
            document.removeEventListener("keydown", keydownHandler);
            document.removeEventListener("keypress", keypressHandler);
            document.removeEventListener("keyup", keyupHandler);
            document.removeEventListener("mousedown", mousedownHandler);
            document.removeEventListener("contextmenu", contextmenuHandler);
            document.removeEventListener("mouseup", mouseupHandler);
            document.removeEventListener("wheel", wheelHandler, {
                passive: false,
            } as EventListenerOptions);
            document.removeEventListener("mousemove", mousemoveHandler);
        });
    }
    //#endregion

    //#region Private Fields
    private m_data = {
        title: "",
        width: 0,
        height: 0,
        VSync: false,
        eventCallback: noop as EventCallBackFn,
    };
    //#endregion
}