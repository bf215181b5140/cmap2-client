import { ArgumentType, Client, Message, Server } from 'node-osc';
import { VrcParameter } from 'cmap2-shared';
import { Settings } from '../../shared/types/settings';

export abstract class OscService {
    private oscServer: Server | undefined;
    private oscClient: Client | undefined;
    protected oscSettings: Settings | undefined;

    private ignoredParams: Set<string> = new Set(['/avatar/parameters/VelocityZ', '/avatar/parameters/VelocityY', '/avatar/parameters/VelocityX',
                                                  '/avatar/parameters/InStation', '/avatar/parameters/Seated', '/avatar/parameters/Upright',
                                                  '/avatar/parameters/AngularY', '/avatar/parameters/Grounded', '/avatar/parameters/Face',
                                                  '/avatar/parameters/GestureRightWeight', '/avatar/parameters/GestureRight',
                                                  '/avatar/parameters/GestureLeftWeight', '/avatar/parameters/GestureLeft', '/avatar/parameters/Voice',
                                                  '/avatar/parameters/Viseme', '/avatar/parameters/VelocityMagnitude']);

    protected constructor(settings: Settings) {
        this.start(settings);
    }

    protected abstract received(vrcParameter: VrcParameter): void;
    protected abstract activity(): void;

    /**
     * Starts or restarts OSC server and client along with handling new OSC messages
     * @param settings
     * @private
     */
    protected start(settings: Settings) {
        if (this.oscServer) this.oscServer.close();
        if (this.oscClient) this.oscClient.close();

        this.oscSettings = {...settings};

        this.oscClient = new Client(settings.oscIp, settings.oscInPort);
        this.oscServer = new Server(settings.oscOutPort, settings.oscIp);

        this.oscServer.on('message', (message: [string, ...ArgumentType[]]) => {
            this.activity();

            // filter parameters
            if (!this.ignoredParams.has(message[0])) {

                const path = message[0];
                const value = this.valueFromArgumentType(message[1]);

                const vrcParameter: VrcParameter = {path, value};

                this.received(vrcParameter);
            }
        });
    }

    /**
     * Sends new OSC message to VRChat
     * @param message
     * @private
     */
    protected send(message: Message) {
        if (this.oscClient) {
            this.oscClient.send(message);
        }
    }

    /**
     * Gets value from OSC message argument
     * @param arg
     * @private
     */
    private valueFromArgumentType(arg: ArgumentType): boolean | number | string {
        if (typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string') {
            return arg;
        } else {
            return arg.value;
        }
    }
}
