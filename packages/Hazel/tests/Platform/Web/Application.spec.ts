import { test, expect, beforeEach } from "vitest";
import { Application } from "@pw/Hazel/Platform/Web/Application";
import { setApp } from "@pw/Hazel/Hazel";
import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><canvas id="canvas"></canvas>`);

beforeEach(() => {
    // @ts-expect-error singleton app. but test need.
    setApp(null);
});

// canvas not supported in jsdom
test.skip("Application runs without errors", () => {
    const canvas = dom.window.document.createElement("canvas");
    const app = new Application({
        el: canvas,
        title: "Test App",
        width: 800,
        height: 600,
    });
    expect(() => app.run()).not.toThrow();
});

// canvas not supported in jsdom
test.skip("Application handles events correctly", () => {
    const canvas = dom.window.document.createElement("canvas");
    const app = new Application({
        el: canvas,
        title: "Test App",
        width: 800,
        height: 600,
    });
    const event = { handled: false };
    app.onEvent(event as any);
    expect(event.handled).toBe(true);
});
