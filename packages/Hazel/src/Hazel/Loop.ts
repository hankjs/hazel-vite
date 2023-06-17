export abstract class Loop {
    abstract while(segment: CallableFunction): void;
    static create: () => Loop;

    start() {
        this.m_stop = false;
    }

    stop() {
        this.m_stop = true;
    }

    protected m_stop = false;
}
