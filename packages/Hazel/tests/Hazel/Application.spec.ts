import { describe, test, expect, beforeEach, vi } from "vitest";
import { Application } from "@pw/Hazel/Hazel";
import { setApp } from "@pw/Hazel/Hazel/Application";
import { Layer } from "@pw/Hazel/Hazel/Layer";

class ApplicationImpl extends Application {}
class LayerImpl extends Layer {
    onAttach(): void {}
    onDetach(): void {}
    onUpdate(): void {}
}

beforeEach(() => {
    // @ts-expect-error singleton app. but test need.
    setApp(null);
});

// canvas not supported in jsdom
describe.skip("Application", () => {
    test("Application getInstance returns the same instance", () => {
        const app1 = new ApplicationImpl({
            title: "Test",
            width: 800,
            height: 600,
            el: document.createElement("div"),
        });
        const app2 = Application.getInstance();
        expect(app1).toBe(app2);
    });

    test("Application singleton", () => {
        new ApplicationImpl({
            title: "Test",
            width: 800,
            height: 600,
            el: document.createElement("div"),
        });

        expect(
            () =>
                new ApplicationImpl({
                    title: "Test",
                    width: 800,
                    height: 600,
                    el: document.createElement("div"),
                }),
        ).toThrowError();
    });

    describe("Layer", () => {
        test("LayerStack is empty", () => {
            const app = new ApplicationImpl({
                title: "Test",
                width: 800,
                height: 600,
                el: document.createElement("div"),
            });
            expect(app.layerStack.size()).toBe(0);
        });

        test("add Layer", () => {
            const app = new ApplicationImpl({
                title: "Test",
                width: 800,
                height: 600,
                el: document.createElement("div"),
            });
            const layer = new LayerImpl();
            const spyLayerAttach = vi.spyOn(layer, "onAttach");
            app.pushLayer(layer);
            expect(app.layerStack.size()).toBe(1);
            expect(spyLayerAttach).toHaveBeenCalled();
        })
    });
});
