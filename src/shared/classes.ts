export class ClientCredentials {
    serverUrl: string = '';
    username: string = '';
    password: string = '';
    apiToken: string | undefined | null;
    autoLogin: boolean = false;
}

export class ApplicationSettings {
    startMinimized: boolean | undefined | null;
}
