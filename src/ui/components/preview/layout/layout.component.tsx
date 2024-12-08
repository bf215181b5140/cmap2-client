import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { ThemeDTO } from 'cmap2-shared';

export const LAYOUT_ELEMENT_GAP = '20px';

const Layout = styled.div<{ theme: ThemeDTO }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  gap: ${LAYOUT_ELEMENT_GAP};
  width: 100%;
  border-radius: 8px;

  ${props => layoutThemes[props.theme.id]};
`;

export default Layout;

const layoutThemes: { [key: string]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {};

layoutThemes.vrcGreen = css`
  background: ${props => props.theme.colors.ui.appBgOpaque};
`;

layoutThemes.vrcGrey = css`
  background: ${props => props.theme.colors.ui.appBgOpaque};
`;
