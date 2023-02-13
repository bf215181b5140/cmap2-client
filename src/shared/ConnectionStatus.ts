export class ConnectionStatus {
    code: ConnectionStatusCode = ConnectionStatusCode.DISCONNECTED;
    message: string = '';
    description: string = '';

    constructor(code: ConnectionStatusCode) {
        this.setStatus(code);
    }

    public setStatus(code: ConnectionStatusCode) {
        this.code = code;
        switch (code) {
            case ConnectionStatusCode.NO_CREDENTIALS:
                this.message = 'Waiting';
                this.description = 'Fill out your login and server address to connect';
                break;
            case ConnectionStatusCode.CONNECTING:
                this.message = 'Connecting';
                this.description = 'Waiting for server connection';
                break;
            case ConnectionStatusCode.AUTHENTICATING:
                this.message = 'Connecting';
                this.description = 'Waiting for server authentication';
                break;
            case ConnectionStatusCode.AUTHENTICATION_FAILED:
                this.message = 'Authentication failed';
                this.description = 'Your login information for the specified server is wrong';
                break;
            case ConnectionStatusCode.CONNECTED:
                this.message = 'Connected';
                this.description = 'Connection to server established';
                break;
            case ConnectionStatusCode.ERROR:
                this.message = 'Error';
                this.description = 'There has been an error establishing connection with server';
                break;
            case ConnectionStatusCode.DISCONNECTED:
            default:
                this.message = 'Disconnected';
                this.description = 'Not connected to the server';
                break;
        }
    }
}

export enum ConnectionStatusCode {
    NO_CREDENTIALS,
    CONNECTING,
    AUTHENTICATING,
    AUTHENTICATION_FAILED,
    CONNECTED,
    ERROR,
    DISCONNECTED,
}
