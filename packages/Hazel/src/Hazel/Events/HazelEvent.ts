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

        Object.assign(target.prototype, {
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
export abstract class HazelEvent {
    //#region eventClassType
    /** use Descriptor {eventClassType} to implement */
    static getStaticType: () => EventType
    getType(): EventType {
        throw new Error("Method not implemented.");
    };
    getName(): EventTypeKey {
        throw new Error("Method not implemented.");
    };
    //#endregion

    //#region eventClassCategory
    /** use Descriptor {eventClassCategory} to implement */
    getCategoryFlags() : EventCategory {
        throw new Error("Method not implemented.");
    };
    //#endregion

    isInCategory(category: EventCategory): boolean {
        return BIT.contain(this.getCategoryFlags(), category);
    }

    handled = false;
}

export class EventDispatcher {
    constructor(event: HazelEvent) {
        this.event = event;
    }

    /**
     * @param event EventClass
     * @param func return boolean to indicate whether the event is handled
     * @returns 
     */
    dispatch<T extends HazelEvent>(
        event: {
            getStaticType: () => EventType;
        },
        func: (event: T) => boolean,
    ) {
        if (this.event.getType() === event.getStaticType()) {
            this.event.handled = func(this.event as T);
            return true;
        }
        return false;
    }

    private event: HazelEvent;
}
