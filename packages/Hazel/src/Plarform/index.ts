import { Window as _Window } from "../Hazel/Window";

const PLATFORM = import.meta.env.VITE_PLATFORM;

let modules: any;

switch (PLATFORM) {
    case "Web":
        modules = import.meta.glob(`./Web/*.ts`, { eager: true });
        break;

    default:
        throw new Error(`Unsupported platform: ${PLATFORM}`);
}

const Window = modules[`./${PLATFORM}/Window.ts`].Window as typeof _Window;

export { Window };
