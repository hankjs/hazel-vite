import { test, expect, beforeEach } from "vitest";
import { WebApplication } from "@pw/Hazel/Platform/Web/WebApplication";
import { JSDOM } from "jsdom";
import { setApp } from "@pw/Hazel/Hazel/Application";

const dom = new JSDOM(`<!DOCTYPE html><canvas id="canvas"></canvas>`);

beforeEach(() => {
    // @ts-expect-error singleton app. but test need.
    setApp(null);
});

// canvas not supported in jsdom
test.skip("Application runs without errors", () => {
    const canvas = dom.window.document.createElement("canvas");
    const app = new WebApplication({
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
    const app = new WebApplication({
        el: canvas,
        title: "Test App",
        width: 800,
        height: 600,
    });
    const event = { handled: false };
    app.onEvent(event as any);
    expect(event.handled).toBe(true);
});
