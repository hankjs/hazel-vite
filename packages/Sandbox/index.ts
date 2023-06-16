import type { Hazel } from "@hazel/hazel";
import { SandboxApp as _SandboxApp } from "./src/SandboxApp";

export namespace Sandbox {
    export const SandboxApp = _SandboxApp;

    export const createApplication: Hazel.CreateApplication = () =>
        new SandboxApp();
}
