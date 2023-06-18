import type { WindowProps, CreateApplication } from "@hazel/hazel";
import { SandboxApp as _SandboxApp } from "./SandboxApp";

export const SandboxApp = _SandboxApp;

export const createApplication: CreateApplication = (props: WindowProps) =>
    new SandboxApp(props);
