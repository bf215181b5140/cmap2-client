import { theme } from 'cmap2-shared/src/react/theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}
