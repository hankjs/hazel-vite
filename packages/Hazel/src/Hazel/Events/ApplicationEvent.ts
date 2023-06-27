import { EventCategory, eventClassCategory, eventClassType, HazelEvent, EventType } from "./HazelEvent";

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.WindowResize)
export class WindowResizeEvent extends HazelEvent {
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
export class WindowCloseEvent extends HazelEvent {
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.AppTick)
export class AppTickEvent extends HazelEvent {
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.AppUpdate)
export class AppUpdateEvent extends HazelEvent {
}

@eventClassCategory(EventCategory.EventCategoryApplication)
@eventClassType(EventType.AppRender)
export class AppRenderEvent extends HazelEvent {
}
