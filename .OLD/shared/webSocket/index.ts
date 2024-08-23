export type WebsocketConnectionStatus = 'Connected' | 'Connecting' | 'Not connected';

export class WebsocketConnection {
    status: WebsocketConnectionStatus;
    message?: string;

    constructor(status?: WebsocketConnectionStatus, message?: string) {
        this.status = status || 'Not connected';
    }

    public setStatus(status: WebsocketConnectionStatus, message?: string) {
        this.status = status;
        this.message = message;
    }

    public displayMessage() {
      return `${this.status} to website`;
    }
}
