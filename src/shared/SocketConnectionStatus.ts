export class SocketConnectionStatus {
    code: SocketConnectionStatusCode = SocketConnectionStatusCode.DISCONNECTED;
    message: string = '';
    description: string = '';

    constructor(code: SocketConnectionStatusCode) {
        this.setStatus(code);
    }

    public setStatus(code: SocketConnectionStatusCode) {
        this.code = code;
        switch (code) {
            case SocketConnectionStatusCode.NO_CREDENTIALS:
                this.message = 'Waiting';
                this.description = 'Fill out your login and server address to connect';
                break;
            case SocketConnectionStatusCode.CONNECTING:
                this.message = 'Connecting';
                this.description = 'Waiting for server connection';
                break;
            case SocketConnectionStatusCode.AUTHENTICATING:
                this.message = 'Connecting';
                this.description = 'Waiting for server authentication';
                break;
            case SocketConnectionStatusCode.AUTHENTICATION_FAILED:
                this.message = 'Authentication failed';
                this.description = 'Your login information for the specified server is wrong';
                break;
            case SocketConnectionStatusCode.CONNECTED:
                this.message = 'Connected';
                this.description = 'Connection to server established';
                break;
            case SocketConnectionStatusCode.ERROR:
                this.message = 'Error';
                this.description = 'There has been an error establishing connection with server';
                break;
            case SocketConnectionStatusCode.DISCONNECTED:
            default:
                this.message = 'Disconnected';
                this.description = 'Not connected to the server';
                break;
        }
    }
}

export enum SocketConnectionStatusCode {
    NO_CREDENTIALS,
    CONNECTING,
    AUTHENTICATING,
    AUTHENTICATION_FAILED,
    CONNECTED,
    ERROR,
    DISCONNECTED,
}
