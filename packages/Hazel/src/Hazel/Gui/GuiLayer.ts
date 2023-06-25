import { type Event } from "../Events";
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
    onEvent(event: Event): void {}

    //#region Private Fields
    //#endregion
}

function proxyColor(object: any, name: string) {
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
