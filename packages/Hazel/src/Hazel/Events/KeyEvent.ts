import { key2Num } from "@hazel/share";
import { EventCategory, eventClassCategory, eventClassType, HazelEvent, EventType } from "./HazelEvent";

@eventClassCategory(EventCategory.EventCategoryKeyboard | EventCategory.EventCategoryInput)
export class KeyEvent extends HazelEvent {
    constructor(
        protected code: string
    ) { super(); }

    getKeyCode() {
        return key2Num(this.code);
    }
}

@eventClassType(EventType.KeyPressed)
export class KeyPressedEvent extends KeyEvent {
    constructor(
        code: string,
        private repeat: boolean
    ) {
        super(code);
    }

    getRepeatCount() {
        return this.repeat;
    }

    toString(): string {
        return `KeyPressedEvent: ${this.code} (${this.repeat} repeats)`;
    }
}

@eventClassType(EventType.KeyReleased)
export class KeyReleasedEvent extends KeyEvent {
    constructor(
        code: string,
    ) {
        super(code);
    }

    toString(): string {
        return `KeyReleasedEvent: ${this.code}`;
    }
}

@eventClassType(EventType.KeyTyped)
export class KeyTypedEvent extends KeyEvent {
    constructor(
        code: string,
    ) {
        super(code);
    }

    toString(): string {
        return `KeyTypedEvent: ${this.code}`;
    }
}

