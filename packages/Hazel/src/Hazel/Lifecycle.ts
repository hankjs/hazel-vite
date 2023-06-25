export abstract class Lifecycle {
    abstract onAttach(): void;

    abstract onDetach(): void;

    abstract onUpdate(ts: number): void;
}
