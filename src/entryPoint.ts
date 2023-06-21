import { createApplication } from "@hazel/sandbox";

export function main() {
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    if (!canvas) {
        throw new Error(`Cannot find element #canvas`);
    }

    const app = createApplication({
        title: "Hazel",
        width: window.innerWidth,
        height: window.innerHeight,
        el: canvas,
    });

    app.run();
}
