export class ClientCredentials {
    serverUrl: string = '';
    username: string = '';
    password: string = '';
    apiToken: string | undefined | null;
}

export class ApplicationSettings {
    startMinimized: boolean | undefined | null;
    autoLogin: boolean | undefined | null;
}
