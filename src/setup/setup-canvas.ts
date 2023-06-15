export function setupCanvas(canvas: HTMLCanvasElement) {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas);
}