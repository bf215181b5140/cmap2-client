import { theme } from 'cmap2-shared/src/react/theme';
import { IpcGetOptions, IpcReceiveOptions, IpcSendOptions } from '../electron/ipc/typedIpc.model';
import { IPC } from '../shared/preload';

type ThemeType = typeof theme;

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}

declare global {
    interface Window {
        IPC: IPC;
    }
}
