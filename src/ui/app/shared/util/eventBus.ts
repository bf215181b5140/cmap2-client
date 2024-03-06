export class EventBus<T> {
    private listeners: { [event: string]: Array<(data: T) => void> } = {};

    on(event: string, callback: (data: T) => void) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    off(event: string, callback: (data: T) => void) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        }
    }

    emit(event: string, data: T) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((listener) => listener(data));
        }
    }
}
