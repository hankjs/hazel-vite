import * as Hazel from "@pw/Hazel/Hazel";

const PLATFORM = import.meta.env.VITE_PLATFORM;

let modules: any;

console.log(`[Core] Hazel init Platform: ${PLATFORM}`);
if (PLATFORM === "Web") {
    modules = import.meta.glob(`./Web/*.ts`, { eager: true });
} else {
    throw new Error(`Unsupported platform: ${PLATFORM}`);
}



export const Application = modules[`./${PLATFORM}/Application.ts`]
    .Application as typeof Hazel.Application;

export const AppWindow = modules[`./${PLATFORM}/AppWindow.ts`]
    .AppWindow as typeof Hazel.AppWindow;

export const Loop = modules[`./${PLATFORM}/Loop.ts`].Loop as typeof Hazel.Loop;
export const Input = modules[`./${PLATFORM}/Input.ts`]
    .Input as typeof Hazel.Input;
