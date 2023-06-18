import { listenElementRemove } from "@hazel/share";
import {
    WindowCloseEvent,
    WindowResizeEvent,
} from "@pw/Hazel/Hazel/Events/ApplicationEvent";
import {
    KeyPressedEvent,
    KeyReleasedEvent,
    KeyTypedEvent,
} from "@pw/Hazel/Hazel/Events/KeyEvent";
import {
    MouseButtonPressedEvent,
    MouseButtonReleasedEvent,
    MouseMovedEvent,
    MouseScrolledEvent,
} from "@pw/Hazel/Hazel/Events/MouseEvent";
import {
    AppWindow as _AppWindow,
    type EventCallBackFn,
    type WindowProps as _WindowProps,
} from "@pw/Hazel/Hazel/AppWindow";
import { GraphicsContext } from "../Renderer";

export type WindowProps = _WindowProps<HTMLCanvasElement>;

const noop = () => {};

export class AppWindow extends _AppWindow {
    #container!: HTMLCanvasElement;
    isOutside = false;

    getContainer() {
        return this.#container;
    }

    static create(props: WindowProps): _AppWindow {
        return new AppWindow(props);
    }

    getWidth(): number {
        return this.#data.width;
    }

    getHeight(): number {
        return this.#data.height;
    }

    constructor(props: WindowProps) {
        super();
        this.init(props);
    }

    onUpdate(): void {}
    onAttach(): void {}
    onDetach(): void {}

    setVSync(enabled: boolean): void {
        this.#data.VSync = enabled;
    }

    isVSync(): boolean {
        return this.#data.VSync;
    }

    setEventCallback(callback: EventCallBackFn) {
        this.#data.eventCallback = callback;
    }

    //#region Private Methods
    init(props: WindowProps) {
        let { el } = props;
        if (typeof el === "string") {
            const canvas = document.querySelector(el);
            if (!canvas) {
                throw new Error(`Cannot find element ${el}`);
            }
            el = canvas as HTMLCanvasElement;
        }
        this.#container = el;
        this.#data.title = props.title;
        this.#data.width = props.width;
        this.#data.height = props.height;

        this.#container.style.width = `${props.width}px`;
        this.#container.style.height = `${props.height}px`;

        this.context = new GraphicsContext(this.#container);
        this.context.init();

        console.info(
            `Creating window ${props.title} ${props.width} ${props.height}`,
        );

        //#region Bind Event Handlers
        const resizeHandler = () => {
            const rect = this.#container.getBoundingClientRect();
            const event = new WindowResizeEvent(rect.width, rect.height);
            this.#data.eventCallback(event);
        };
        window.addEventListener("resize", resizeHandler);

        const keydownHandler = (event: KeyboardEvent) => {
            if (this.isOutside) return;
            this.#data.eventCallback(
                new KeyPressedEvent(event.code, event.repeat),
            );
        };
        document.addEventListener("keydown", keydownHandler);

        const keypressHandler = (event: KeyboardEvent) => {
            if (this.isOutside) return;
            this.#data.eventCallback(new KeyTypedEvent(event.code));
        };
        document.addEventListener("keypress", keypressHandler);

        const keyupHandler = (event: KeyboardEvent) => {
            if (this.isOutside) return;
            this.#data.eventCallback(new KeyReleasedEvent(event.code));
        };
        document.addEventListener("keyup", keyupHandler);

        const mousedownHandler = (event: MouseEvent) => {
            if (this.isOutside) return;
            this.#data.eventCallback(new MouseButtonPressedEvent(event.button));
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
            this.#data.eventCallback(
                new MouseButtonReleasedEvent(event.button),
            );
        };
        document.addEventListener("mouseup", mouseupHandler);

        const wheelHandler = (event: WheelEvent) => {
            if (this.isOutside) return;
            event.preventDefault();
            event.stopPropagation();
            this.#data.eventCallback(
                new MouseScrolledEvent(event.deltaX, event.deltaY),
            );
        };
        document.addEventListener("wheel", wheelHandler, {
            passive: false,
        });

        const mousemoveHandler = (event: MouseEvent) => {
            const { left, top, width, height } =
                this.#container.getBoundingClientRect();

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
            this.#data.eventCallback(new MouseMovedEvent(elX, elY));
        };
        document.addEventListener("mousemove", mousemoveHandler);
        //#endregion

        //#region Remove Event Handlers
        listenElementRemove(this.#container, () => {
            const event = new WindowCloseEvent();
            this.#data.eventCallback(event);

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
        //#endregion
    }
    //#endregion

    //#region Private Fields
    #data = {
        title: "",
        width: 0,
        height: 0,
        VSync: false,
        eventCallback: noop as EventCallBackFn,
    };
    //#endregion
}
