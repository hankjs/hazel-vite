import { describe, test, expect } from "vitest";
import { WebLoop } from "src/Platform/Web/WebLoop";

describe("Loop", () => {
    test("while", async () => {
        let count = 0;
        const loop = WebLoop.create();
        loop.while(async () => {
            count++;
            if (count === 10) {
                loop.stop();
            }
        });
        await new Promise((resolve) => {
            loop.onStopped = resolve;
        });
        expect(count).toBe(10);
    });

    test("done callback", () => {
        let count = 0;
        const loop = WebLoop.create();
        loop.while(() => {
            count++;
            if (count === 10) {
                loop.stop();
            }
        }, () => {
            expect(count).toBe(10);
        });
    })
});
