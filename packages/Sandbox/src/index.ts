import type { Hazel } from "@hazel/hazel";
import { SandboxApp as _SandboxApp } from "./SandboxApp";

export namespace Sandbox {
    export const SandboxApp = _SandboxApp;

    export const createApplication: Hazel.CreateApplication = (
        props: Hazel.WindowProps,
    ) => new SandboxApp(props);
}
