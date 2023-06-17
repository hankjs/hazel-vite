import { Sandbox } from "@hazel/sandbox";
import { setupCanvas } from "./setup/setup-canvas";

export function main() {
    console.log(`Hazel init Platform: ${import.meta.env.VITE_PLATFORM}`);

    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    if (!canvas) {
        throw new Error(`Cannot find element #canvas`);
    }

    setupCanvas(canvas);

    const app = Sandbox.createApplication({
        title: "Hazel",
        width: window.innerWidth,
        height: window.innerHeight,
        el: canvas,
    });

    app.run();
}
