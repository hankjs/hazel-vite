import { Sandbox } from "@hazel/sandbox";

export function main() {
    console.log(1);
    const app = new Sandbox.SandboxApp();
    app.run();
}
