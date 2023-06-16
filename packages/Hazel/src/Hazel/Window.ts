import { Event } from "./Events/Event";
import { Lifecycle } from "./Lifecycle";

export interface WindowProps<E = Element> {
    title: string;
    width: number;
    height: number;
    el?: E;
}

export type EventCallBackFn = (e: Event) => void;
export abstract class Window extends Lifecycle {
    static create: <P extends WindowProps<any>>(props?: P) => Window 

    abstract getWidth(): number 
    abstract getHeight(): number 
    abstract setEventCallback(callback: EventCallBackFn): void 
    abstract setVSync(enabled: boolean): void 
    abstract isVSync(): boolean 
}