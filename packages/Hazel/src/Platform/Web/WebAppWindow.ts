import { listenElementRemove } from "@hazel/share";
import { EventType, type Event } from "@pw/Hazel/Hazel/Events/Event";
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
    AppWindow,
    type EventCallBackFn,
    type WindowProps as _WindowProps,
} from "@pw/Hazel/Hazel/AppWindow";
import { GraphicsContext } from "@pw/Hazel/Hazel/Renderer/GraphicsContext";

export type WindowProps = _WindowProps<HTMLCanvasElement>;

const noop = () => {};

export class WebAppWindow extends AppWindow {
    getContainer() {
        return this.#canvas;
    }

    static create(props: WindowProps): AppWindow {
        return new WebAppWindow(props);
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
        this.#canvas = el;
        this.#container = this.#canvas.parentElement || document.body;
        this.#data.title = props.title;
        this.#data.width = props.width;
        this.#data.height = props.height;

        this.#canvas.style.width = `${props.width}px`;
        this.#canvas.style.height = `${props.height}px`;

        this.context = GraphicsContext.create(this.#canvas);
        this.context.init();

        console.info(
            `Creating window ${props.title} ${props.width} ${props.height}`,
        );

        //#region Bind Event Handlers
        const resizeHandler = () => {
            const rect = this.#container.getBoundingClientRect();
            this.handleEvent(new WindowResizeEvent(rect.width, rect.height));
        };
        window.addEventListener("resize", resizeHandler);

        const keydownHandler = (event: KeyboardEvent) => {
            if (this.#isOutside) return;
            this.handleEvent(new KeyPressedEvent(event.code, event.repeat));
        };
        document.addEventListener("keydown", keydownHandler);

        const keypressHandler = (event: KeyboardEvent) => {
            if (this.#isOutside) return;
            this.handleEvent(new KeyTypedEvent(event.code));
        };
        document.addEventListener("keypress", keypressHandler);

        const keyupHandler = (event: KeyboardEvent) => {
            if (this.#isOutside) return;
            this.handleEvent(new KeyReleasedEvent(event.code));
        };
        document.addEventListener("keyup", keyupHandler);

        const mousedownHandler = (event: MouseEvent) => {
            if (this.#isOutside) return;
            this.handleEvent(new MouseButtonPressedEvent(event.button));
        };
        document.addEventListener("mousedown", mousedownHandler);

        const contextmenuHandler = (event: MouseEvent) => {
            if (this.#isOutside) return;
            event.preventDefault();
            event.stopPropagation();
        };
        document.addEventListener("contextmenu", contextmenuHandler);

        const mouseupHandler = (event: MouseEvent) => {
            if (this.#isOutside) return;
            this.handleEvent(new MouseButtonReleasedEvent(event.button));
        };
        document.addEventListener("mouseup", mouseupHandler);

        const wheelHandler = (event: WheelEvent) => {
            if (this.#isOutside) return;
            event.preventDefault();
            event.stopPropagation();
            this.handleEvent(
                new MouseScrolledEvent(event.deltaX, event.deltaY),
            );
        };
        document.addEventListener("wheel", wheelHandler, {
            passive: false,
        });

        const mousemoveHandler = (event: MouseEvent) => {
            const { left, top, width, height } =
                this.#canvas.getBoundingClientRect();

            const elementPositionX = left + window.pageXOffset;
            const elementPositionY = top + window.pageYOffset;

            const elX = event.pageX - elementPositionX;
            const elY = event.pageY - elementPositionY;

            this.#isOutside =
                width === 0 ||
                height === 0 ||
                elX < 0 ||
                elY < 0 ||
                elX > width ||
                elY > height;
            if (this.#isOutside) return;
            this.handleEvent(new MouseMovedEvent(elX, elY));
        };
        document.addEventListener("mousemove", mousemoveHandler);
        //#endregion

        //#region Remove Event Handlers
        listenElementRemove(this.#canvas, () => {
            const event = new WindowCloseEvent();
            this.handleEvent(event);

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

    handleEvent(event: Event) {
        if (event.getType() === EventType.WindowResize) {
            const resizeEvent = event as WindowResizeEvent;
            this.#canvas.style.width = `${resizeEvent.getWidth()}px`;
            this.#canvas.style.height = `${resizeEvent.getHeight()}px`;
        }
        this.#data.eventCallback(event);
    }

    //#region Private Fields
    #data = {
        title: "",
        width: 0,
        height: 0,
        VSync: false,
        eventCallback: noop as EventCallBackFn,
    };
    #container!: HTMLElement;
    #canvas!: HTMLCanvasElement;
    #isOutside = false;
    //#endregion
}
