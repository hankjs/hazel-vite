import { EventCategory, eventClassCategory, eventClassType, Event, EventType } from "./Event";

@eventClassCategory(EventCategory.EventCategoryMouse | EventCategory.EventCategoryInput)
@eventClassType(EventType.MouseMoved)
export class MouseMovedEvent extends Event {
    constructor(
        protected mouseX: number,
        protected mouseY: number,
    ) { super(); }

    getX() {
        return this.mouseX;
    }
    getY() {
        return this.mouseY;
    }

    toString(): string {
        return `MouseMovedEvent: ${this.mouseX}, ${this.mouseY}`;
    }
}

@eventClassCategory(EventCategory.EventCategoryMouse | EventCategory.EventCategoryInput)
@eventClassType(EventType.MouseScrolled)
export class MouseScrolledEvent extends Event {
    constructor(
        protected m_XOffset: number,
        protected m_YOffset: number,
    ) { super(); }

    getXOffset() {
        return this.m_XOffset;
    }

    getYOffset() {
        return this.m_YOffset;
    }

    toString(): string {
        return `MouseScrolledEvent: ${this.m_XOffset}, ${this.m_YOffset}`;
    }
}

@eventClassCategory(EventCategory.EventCategoryMouse | EventCategory.EventCategoryInput)
export class MouseButtonEvent extends Event {
    constructor(
        protected m_Button: number,
    ) { super(); }

    getMouseButton() {
        return this.m_Button;
    }
}

@eventClassType(EventType.MouseButtonPressed)
export class MouseButtonPressedEvent extends MouseButtonEvent {
    constructor(
        button: number,
    ) {
        super(button);
    }

    toString(): string {
        return `MouseButtonPressedEvent: ${this.m_Button}`;
    }
}

@eventClassType(EventType.MouseButtonReleased)
export class MouseButtonReleasedEvent extends MouseButtonEvent {
    constructor(
        button: number,
    ) {
        super(button);
    }

    toString(): string {
        return `MouseButtonReleasedEvent: ${this.m_Button}`;
    }
}
