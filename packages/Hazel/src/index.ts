export { Application } from "./Hazel";

export { type WindowProps } from "./Hazel";

export { Input, Event, EventType, KeyEvent } from "./Hazel";

export { Layer, DatGuiLayer } from "./Hazel";

import { type WindowProps } from "./Hazel";
import type { Application } from "./Hazel/Application";

// To be defined in CLIENT
export type CreateApplication = (props: WindowProps) => Application;
