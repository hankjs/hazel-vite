import { Hazel } from "@hazel/hazel";
import type { Event } from "@pw/Hazel/Hazel/Events";

export class SandboxApp extends Hazel.Application {
    onEvent(event: Event): void {
        console.log("event", event);
        console.log(event.getName());
    }
}
