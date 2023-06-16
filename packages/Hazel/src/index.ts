import { Application as _Application } from "./Hazel/Application";

export namespace Hazel {
    interface Application {
        run(): void;
    }
    export const Application = _Application;

	// To be defined in CLIENT
    export type CreateApplication = () => Application;
}
