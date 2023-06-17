import { Event } from "./Events/Event";
import { Lifecycle } from "./Lifecycle";

export interface WindowProps<E = Element> {
    title: string;
    width: number;
    height: number;
    el: string | E;
}

export type EventCallBackFn = (e: Event) => void;
export abstract class AppWindow extends Lifecycle {
    static create: <P extends WindowProps<any>>(props: P) => AppWindow 

    abstract getWidth(): number 
    abstract getHeight(): number 
    abstract setEventCallback(callback: EventCallBackFn): void 
    abstract setVSync(enabled: boolean): void 
    abstract isVSync(): boolean 
}