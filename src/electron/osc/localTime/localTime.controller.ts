import TypedIpcMain from '../../ipc/typedIpcMain';
import { LocalTimeSettings } from './types';
import { BridgeService } from '../../bridge/bridge.service';
import { VrcParameter } from 'cmap2-shared';
import { Message } from 'node-osc';
import OscControlStore from '../../store/oscControl/oscControl.store';

export default class LocalTimeController {
    private settings: LocalTimeSettings;
    private sendToAvatarInterval: NodeJS.Timeout | undefined;
    private sendToChatboxInterval: NodeJS.Timeout | undefined;

    constructor() {
        this.settings = OscControlStore.getLocalTimeSettings();

        this.start();

        TypedIpcMain.on('setLocalTimeSettings', (data) => {
            this.settings = data;
            this.start();
        });
    }

    private start() {
        if (this.settings.sendToChatbox) {
            if (this.sendToChatboxInterval) clearInterval(this.sendToChatboxInterval);
            this.sendToChatboxInterval = setInterval(() => this.sendToChatbox(), 1000);
        } else {
            if (this.sendToChatboxInterval) clearInterval(this.sendToChatboxInterval);
        }

        if (this.settings.sendToAvatar) {
            if (this.sendToAvatarInterval) clearInterval(this.sendToAvatarInterval);
            this.sendToAvatarInterval = setInterval(() => this.sendToAvatar(), 1000);
        } else {
            if (this.sendToAvatarInterval) clearInterval(this.sendToAvatarInterval);
        }
    }

    private sendToChatbox() {
        const currentTime = new Date();

        // todo check does THIS.settings work in this context
        let text: string = this.settings?.chatboxFormat ?? '';
        let formattedText: string;

        // todo need more formats, make a shared util function to replace string
        formattedText = text.replace('{time}', currentTime.toLocaleTimeString());

        // https://docs.vrchat.com/docs/osc-as-input-controller
        // send new Message() instead of VrcParameter
        const oscMessage: Message = new Message('/chatbox/input', formattedText, true);

        // todo sendOscMessage need to be Message type
        // BridgeService.emit('sendOscMessage', oscMessage);
    }

    private sendToAvatar() {
        const currentTime = new Date();
        // todo check does THIS.settings work in this context
        this.settings?.avatarParameters.forEach(parameter => {
            let value: number;
            switch (parameter.unit) {
                case 'second':
                    value = currentTime.getSeconds();
                    break;
                case 'minute':
                    value = currentTime.getMinutes();
                    break;
                case 'hour':
                    value = currentTime.getHours();
                    break;
                case 'day':
                    value = currentTime.getDay();
                    break;
                case 'month':
                    value = currentTime.getMonth();
                    break;
                case 'year':
                    value = currentTime.getFullYear() % 100;
                    break;
            }
            const vrcParameter: VrcParameter = {
                path: parameter.path,
                value: value,
            };
            BridgeService.emit('sendOscMessage', vrcParameter);
        });
    }
}
