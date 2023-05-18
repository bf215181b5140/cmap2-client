export class ClientCredentials {
    username: string = '';
    password: string = '';
    apiToken: string | undefined | null;
}

export class OscSettings {
    oscIp: string | undefined | null;
    oscInPort: number | undefined | null;
    oscOutPort: number | undefined | null;

    constructor() {
        this.oscIp = '127.0.0.1';
        this.oscInPort = 9000;
        this.oscOutPort = 9001;
    }
}

export class ApplicationSettings extends OscSettings {
    startMinimized: boolean | undefined | null;
    autoLogin: boolean | undefined | null;
}
