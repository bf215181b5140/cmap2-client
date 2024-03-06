import TypedIpcMain from '../../ipc/typedIpcMain';
import { OscClockSettings, OscClockUnit } from './types';
import { BridgeService } from '../../bridge/bridge.service';
import { VrcParameter } from 'cmap2-shared';
import { Message } from 'node-osc';
import OscControlStore from '../../store/oscControl/oscControl.store';
import oscClockChatboxText from './chatboxText';

export default class OscClockController {
    private settings: OscClockSettings;
    private sendToAvatarInterval: NodeJS.Timeout | undefined;
    private sendToChatboxInterval: NodeJS.Timeout | undefined;

    constructor() {
        this.settings = OscControlStore.getOscClockSettings();

        this.start();

        TypedIpcMain.on('setOscClockSettings', (data) => {
            this.settings = data;
            this.start();
        });
    }

    /**
     * Check the settings and start sending to chatbox and/or avatar.
     * Trigger send command right away, so we don't wait for interval timer.
     * Clear interval when setting a new one.
     */
    private start() {
        if (this.settings.sendToChatbox) {
            this.sendToChatbox();
            if (this.sendToChatboxInterval) clearInterval(this.sendToChatboxInterval);
            this.sendToChatboxInterval = setInterval(() => this.sendToChatbox(), 20000);
        } else {
            if (this.sendToChatboxInterval) clearInterval(this.sendToChatboxInterval);
        }

        if (this.settings.sendToAvatar && this.settings?.avatarParameters.length > 0) {
            this.sendToAvatar();
            if (this.sendToAvatarInterval) clearInterval(this.sendToAvatarInterval);
            // if there is a Seconds parameter, update every second
            // otherwise update every 10 seconds
            const updateSeconds = !!this.settings?.avatarParameters.find(parameter => parameter.unit === OscClockUnit.Second);
            const updateRate = updateSeconds ? 1000 : 10000;
            this.sendToAvatarInterval = setInterval(() => this.sendToAvatar(), updateRate);
        } else {
            if (this.sendToAvatarInterval) clearInterval(this.sendToAvatarInterval);
        }
    }

    private sendToChatbox() {
        let text: string = this.settings?.chatboxFormat ?? '';
        let formattedText: string;

        formattedText = oscClockChatboxText(text);

        // https://docs.vrchat.com/docs/osc-as-input-controller
        BridgeService.emit('sendOscMessage', new Message('/chatbox/input', formattedText, true));
    }

    private sendToAvatar() {
        const currentTime = new Date();
        this.settings?.avatarParameters.forEach(parameter => {
            let value: number;
            switch (parameter.unit) {
                case OscClockUnit.Second:
                    value = currentTime.getSeconds();
                    break;
                case OscClockUnit.Minute:
                    value = currentTime.getMinutes();
                    break;
                case OscClockUnit.Hour:
                    value = currentTime.getHours();
                    break;
                case OscClockUnit.Day:
                    value = currentTime.getDay();
                    break;
                case OscClockUnit.Month:
                    value = currentTime.getMonth();
                    break;
                case OscClockUnit.Year:
                    value = currentTime.getFullYear() % 100;
                    break;
            }
            BridgeService.emit('sendOscMessage', new Message(parameter.path, value));
        });
    }
}
