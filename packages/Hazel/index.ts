import { Application as _Application } from "./src/Application";

export namespace Hazel {
    interface Application {
        run(): void;
    }
    export const Application = _Application;

	// To be defined in CLIENT
    export type CreateApplication = () => Application;
}
