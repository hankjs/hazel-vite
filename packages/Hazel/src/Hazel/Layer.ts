import { HazelEvent } from "./Events/HazelEvent";
import { Lifecycle } from "./Lifecycle";

export abstract class Layer extends Lifecycle {
    constructor(name = "Layer") {
        super();
        this.m_debugName = name;
    }

    // @ts-ignore abstract methods props use in implement.
    onEvent(event: HazelEvent): void {
        throw new Error("Method not implemented.");
    }

    protected m_debugName: string;
}