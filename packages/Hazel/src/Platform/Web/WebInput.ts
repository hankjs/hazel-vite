import { key2Num } from "@hazel/share/src";
import { Input as _Input } from "@pw/Hazel/Hazel/Input";
import { WebApplication } from "./WebApplication";

export class WebInput extends _Input {
    constructor() {
        super();
        this.onAttach();
    }

    static create(): WebInput {
        return new WebInput();
    }
    
    //#region overrides for _Input
    static getInstance(): _Input {
        return _Input.getInstance();
    }

    static isKeyPressed(keycode: number): boolean {
        return _Input.isKeyPressed(keycode);
    }

    static isMouseButtonPressed(button: number): boolean {
        return _Input.isMouseButtonPressed(button);
    }

    static getMousePosition(): [x: number, y: number] {
        return _Input.getMousePosition();
    }

    static getMouseX(): number {
        return _Input.getMouseX();
    }

    static getMouseY(): number {
        return _Input.getMouseY();
    }
    //#endregion

    isMouseButtonPressedImpl(button: number): boolean {
        return this.#button.has(button);
    }

    isKeyPressedImpl(keycode: number): boolean {
        return this.#key.has(keycode);
    }

    getMousePositionImpl(): [x: number, y: number] {
        return [this.#position.x, this.#position.y];
    }

    getMouseXImpl(): number {
        return this.#position.x;
    }
    getMouseYImpl(): number {
        return this.#position.y;
    }

    onAttach(): void {
        document.addEventListener("mousedown", this.mousedownHandler);
        document.addEventListener("mouseup", this.mouseupHandler);
        document.addEventListener("keydown", this.keydownHandler);
        document.addEventListener("keyup", this.keyupHandler);
        document.addEventListener("mousemove", this.mousemoveHandler);
        document.addEventListener(
            "visibilitychange",
            this.visibilitychangeHandler,
        );
        window.addEventListener("blur", this.pageLeave);
    }

    onDetach(): void {
        document.removeEventListener("mousedown", this.mousedownHandler);
        document.removeEventListener("mouseup", this.mouseupHandler);
        document.removeEventListener("keydown", this.keydownHandler);
        document.removeEventListener("keyup", this.keyupHandler);
        document.removeEventListener("mousemove", this.mousemoveHandler);
        document.removeEventListener(
            "visibilitychange",
            this.visibilitychangeHandler,
        );
        window.removeEventListener("blur", this.pageLeave);
    }
    onUpdate(): void {}

    //#region private methods
    private mousedownHandler = (event: MouseEvent) => {
        this.#button.set(event.button, event);
    };
    private mouseupHandler = (event: MouseEvent) => {
        this.#button.delete(event.button);
    };
    private mousemoveHandler = (event: MouseEvent) => {
        const app = WebApplication.getInstance() as WebApplication;
        const { left, top } = app.getAppWindow().getContainer().getBoundingClientRect();

        const elementPositionX = left + window.pageXOffset;
        const elementPositionY = top + window.pageYOffset;

        const x = event.pageX - elementPositionX;
        const y = event.pageY - elementPositionY;
        this.#position = {
            x,
            y,
            pageX: event.pageX,
            pageY: event.pageY,
        };
    };

    private keydownHandler = (event: KeyboardEvent) => {
        this.#key.set(key2Num(event.code), event);
    };
    private keyupHandler = (event: KeyboardEvent) => {
        this.#key.delete(key2Num(event.code));
    };
    private visibilitychangeHandler = () => {
        if (!document.hidden) {
            return;
        }

        this.pageLeave();
    };

    private pageLeave = () => {
        this.#button.clear();
        this.#key.clear();
    };
    //#endregion

    //#region private members
    #position = {
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 0,
    };

    #button = new Map<number, MouseEvent>();
    #key = new Map<number, KeyboardEvent>();
    //#endregion
}
