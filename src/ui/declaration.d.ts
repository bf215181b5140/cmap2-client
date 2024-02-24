import 'styled-components';
import { ThemeType } from './theme';

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}
