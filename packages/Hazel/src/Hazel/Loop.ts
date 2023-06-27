export abstract class Loop {
    abstract while(segment: CallableFunction): void;
    static create: () => Loop;

    start() {
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    protected running = false;
}
