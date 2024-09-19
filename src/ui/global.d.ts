import { IPC } from '../shared/preload';
import { theme } from './style/theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}

declare global {
    interface Window {
        IPC: IPC;
    }
}
