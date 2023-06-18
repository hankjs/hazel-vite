export { Application } from "./Platform";

export { type WindowProps } from "./Hazel";

export { Event, EventType, KeyEvent } from "./Hazel";

export { Layer, DatGuiLayer } from "./Hazel";

import { type WindowProps, Application } from "./Hazel";

// To be defined in CLIENT
export type CreateApplication = (props: WindowProps) => Application;

export { Input } from "./Platform";
