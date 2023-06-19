import { Lifecycle } from "./Lifecycle";

let instance: Input;

export abstract class Input extends Lifecycle {
    constructor() {
        super();
        if (instance != null) {
            throw new Error("Input already exists!");
        }
        instance = this;
    }

    static create: () => Input 

    static isKeyPressed(keycode: number): boolean {
        return instance.isKeyPressedImpl(keycode);
    }

    // abstract methods props use in implement.
    static isMouseButtonPressed(button: number): boolean {
        return instance.isMouseButtonPressedImpl(button);
    }

    static getMousePosition(): [x: number, y: number] {
        return instance.getMousePositionImpl();
    }

    static getMouseX(): number {
        return instance.getMouseXImpl();
    }

    static getMouseY(): number {
        return instance.getMouseYImpl();
    }

    static getInstance() {
        return instance;
    }

    // abstract methods props use in implement.
    isKeyPressedImpl(keycode: number): boolean {
        throw new Error("Method not implemented.");
    }
    // abstract methods props use in implement.
    isMouseButtonPressedImpl(button: number): boolean {
        throw new Error("Method not implemented.");
    }

    getMousePositionImpl(): [x: number, y: number] {
        throw new Error("Method not implemented.");
    }
    getMouseXImpl(): number {
        throw new Error("Method not implemented.");
    }
    getMouseYImpl(): number {
        throw new Error("Method not implemented.");
    }

}