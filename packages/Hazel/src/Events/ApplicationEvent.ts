import { EventCategory, eventClassCategory, eventClassType, Event, EventType } from "./Event";

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.WindowResize)
export class WindowResizeEvent extends Event {
    constructor(
        private width: number,
        private height: number
    ) { super(); }

    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }

    toString(): string {
        return `WindowResizeEvent: ${this.width}, ${this.height}`;
    }
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.WindowClose)
export class WindowCloseEvent extends Event {
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.AppTick)
export class AppTickEvent extends Event {
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.AppUpdate)
export class AppUpdateEvent extends Event {
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.AppRender)
export class AppRenderEvent extends Event {
}
