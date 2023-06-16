import { BIT } from "../utils";

export enum EventType {
    None = 0,
    WindowClose,
    WindowResize,
    WindowFocus,
    WindowLostFocus,
    WindowMoved,
    AppTick,
    AppUpdate,
    AppRender,
    KeyPressed,
    KeyReleased,
    KeyTyped,
    MouseButtonPressed,
    MouseButtonReleased,
    MouseMoved,
    MouseScrolled,
}

export type EventTypeKey = keyof typeof EventType;

export enum EventCategory {
    None = 0,
    EventCategoryApplication = BIT(1),
    EventCategoryInput = BIT(2),
    EventCategoryKeyboard = BIT(3),
    EventCategoryMouse = BIT(4),
    EventCategoryMouseButton = BIT(5),
}

/**
 * Descriptor
 * @param eventType 
 * @returns 
 */
export function eventClassType(eventType: EventType) {
    return function (target: any) {
        // Readonly
        Object.defineProperty(target, "getStaticType", {
            value: function () {
                return eventType;
            },
            writable: false,
        });

        Object.setPrototypeOf(target.prototype, {
            getType() {
                return target.getStaticType();
            },
            getName(): EventTypeKey {
                return EventType[eventType] as EventTypeKey;
            }
        });
    }
}

/**
 * Descriptor
 */
export function eventClassCategory(eventCategory: EventCategory) {
    return function (target: any) {
        Object.defineProperty(target.prototype, "getCategoryFlags", {
            value: function () {
                return eventCategory;
            },
        });
    };
}
export abstract class Event {
    /** use Descriptor {eventClassType} to implement */
    static getStaticType: () => EventType
    getType!: () => EventType;
    getName!: () => EventTypeKey;

    /** use Descriptor {eventClassCategory} to implement */
    getCategoryFlags!: () => EventCategory;

    isInCategory(category: EventCategory): boolean {
        return BIT.contain(this.getCategoryFlags(), category);
    }

    m_Handled = false;
}

export class EventDispatcher {
    constructor(event: Event) {
        this.m_Event = event;
    }

    dispatch<T extends Event>(
        event: typeof Event,
        func: (event: T) => boolean,
    ) {
        if (this.m_Event.getType() === event.getStaticType()) {
            this.m_Event.m_Handled = func(this.m_Event as T);
            return true;
        }
        return false;
    }

    private m_Event: Event;
}
