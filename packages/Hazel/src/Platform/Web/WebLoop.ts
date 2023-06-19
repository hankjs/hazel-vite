import { Loop as _Loop } from "../../Hazel/Loop";

const noop = () => {};

export class WebLoop extends _Loop {

    segment!: CallableFunction;
    onStopped: CallableFunction = noop;

    constructor() {
        super();
    }

    while(segment: CallableFunction, onStopped: CallableFunction = noop) {
        this.segment = segment;
        this.onStopped = onStopped;
        window.requestAnimationFrame(this.nextTick.bind(this));
    }

    async nextTick() {
        if (this.m_stop) {
            this.onStopped();
            return;
        }
        await this.segment();
        window.requestAnimationFrame(this.nextTick.bind(this));
    }

    static create() {
        return new WebLoop();
    }
}
