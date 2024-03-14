import { ThemeType } from './app/theme';

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}
