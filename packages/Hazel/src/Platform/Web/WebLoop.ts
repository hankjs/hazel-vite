import { Loop as _Loop } from "../../Hazel/Loop";

const noop = () => {};

export class WebLoop extends _Loop {

    segment!: CallableFunction;
    onStopped: CallableFunction = noop;

    constructor() {
        super();
    }

    while(segment: () => boolean, onStopped: CallableFunction = noop) {
        this.running = true;
        this.segment = segment;
        this.onStopped = onStopped;
        window.requestAnimationFrame(this.nextTick.bind(this));
    }

    async nextTick() {
        if (!this.running) {
            this.onStopped();
            return;
        }
        this.running = await this.segment();
        window.requestAnimationFrame(this.nextTick.bind(this));
    }

    static create() {
        return new WebLoop();
    }
}
