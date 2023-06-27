import { type HazelEvent } from "../Events";
import { Layer } from "../Layer";
import * as dat from "dat.gui";

let gui: dat.GUI;

const folderStack: dat.GUI[] = [];

export class GuiLayer extends Layer {
    static begin(name: string) {
        const folder = gui.addFolder(name);
        folderStack.push(folder);
        return folder;
    }

    static proxy<K extends string | number | symbol>(
        key: K,
        getter: () => any,
        setter: (value: any) => void,
    ) {
        return new Proxy(
            {} as {
                [k in K]: any;
            },
            {
                get(target, p, receiver) {
                    if (key !== p) {
                        return Reflect.get(target, p, receiver);
                    }
                    return getter();
                },
                set(target, p, newValue, receiver) {
                    if (key !== p) {
                        return Reflect.set(target, p, newValue, receiver);
                    }
                    setter(newValue);
                    return true;
                },
            },
        );
    }

    static add: typeof StaticAdd;

    static addColor(object: any, name: string) {
        const folder = folderStack[folderStack.length - 1] || gui;
        folder.addColor(proxyColor(object, name), name);
    }

    static end() {
        folderStack.pop();
    }

    constructor(name = "GuiLayer") {
        super(name);
    }

    onAttach(): void {
        gui = new dat.GUI();
    }
    onDetach(): void {
        gui.destroy();
    }
    onUpdate(): void {}
    onEvent(event: HazelEvent): void {}

    //#region Private Fields
    //#endregion
}

function proxyColor(object: any, name: string | number | symbol) {
    return Object.defineProperty({}, name, {
        get() {
            return glColor2RGB(object[name]);
        },
        set(value) {
            object[name] = RGB2glColor(value);
        },
    });
}

/**
 * [0~1, 0~1, 0~1]
 * [0~255, 0~255, 0~255]
 */
function glColor2RGB(glColor: [number, number, number]) {
    return glColor.map((c) => Math.round(c * 255));
}

function RGB2glColor(RGB: [number, number, number]) {
    return RGB.map((c) => c / 255);
}

// prettier-ignore
declare function StaticAdd<T extends object>( target: T, propName: keyof T, min?: number, max?: number, step?: number,): dat.GUIController;
declare function StaticAdd<T extends object>(
    target: T,
    propName: keyof T,
    status: boolean,
): dat.GUIController;
declare function StaticAdd<T extends object>(
    target: T,
    propName: keyof T,
    items: string[],
): dat.GUIController;
declare function StaticAdd<T extends object>(
    target: T,
    propName: keyof T,
    items: number[],
): dat.GUIController;
declare function StaticAdd<T extends object>(
    target: T,
    propName: keyof T,
    items: Object,
): dat.GUIController;

GuiLayer.add = function add<T extends object = any>(
    object: T,
    name: keyof T,
    min?: number | boolean | string | number[] | Object,
    max?: number,
    step?: number,
): dat.GUIController {
    const folder = folderStack[folderStack.length - 1] || gui;
    const ctrl = folder.add<any>(object, name);
    if (min === undefined) {
        return ctrl;
    }

    if (typeof min === "number") {
        ctrl.min(min);
        if (max !== undefined) {
            ctrl.max(max);
        }
        if (step !== undefined) {
            ctrl.step(step);
        }
    }
    return ctrl;
};
