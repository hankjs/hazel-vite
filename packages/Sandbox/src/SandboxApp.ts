import { Hazel } from "@hazel/hazel";

export class SandboxApp extends Hazel.Application {
    run(): void {
        console.log("Sandbox Application running...");
    }
}
