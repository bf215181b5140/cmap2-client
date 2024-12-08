import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { GroupDTO, GroupWidth, ThemeDTO } from 'cmap2-shared';
import { ReactProps } from '../../../types';
import { MouseEvent } from 'react';
import { LAYOUT_ELEMENT_GAP } from '../layout/layout.component';

interface LayoutGroupProps extends ReactProps {
  theme: ThemeDTO;
  group: GroupDTO;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function LayoutGroup({ theme, group, onClick, children }: LayoutGroupProps) {

  const readonly = !onClick;

  return (<LayoutGroupStyled theme={theme} width={group.width} onClick={onClick} aria-readonly={readonly}>
    {group.showLabel && <h2 className={'layoutGroupLabel'}>{group.label}</h2>}
    <div className={'layoutButtonWrapper'}>
      {children}
    </div>
  </LayoutGroupStyled>);
}

const LayoutGroupStyled = styled.div.attrs(() => ({ className: 'layoutGroup' }))<{ theme: ThemeDTO, width: GroupWidth }>`
  padding: 20px;
  border-radius: 8px;

  .layoutButtonWrapper {
      column-gap: 20px;
      column-fill: balance;
      column-width: 240px;
      gap: 20px;
  }


  flex: ${props => {
  switch (props.width) {
    case 'None':
      return '1';
    case 'Third':
      return `calc(100% * (1 / 3) - ${LAYOUT_ELEMENT_GAP})`;
    case 'Half':
      return ` calc(100% * (1 / 2) - ${LAYOUT_ELEMENT_GAP})`;
    case 'Full':
      return ` calc(100%)`;
    default:
      return undefined;
  }
}};

  ${props => groupThemes[props.theme.id]};
  
  &[aria-readonly='false'] {
    cursor: pointer;
    transition: 0.1s linear;
    
    :hover:not(:has(.layoutButton:hover, .newItem:hover)) {
      box-shadow: inset 0 0 0px 2px ${props => props.theme.colors.ui.highlight4};
    }
  }

  > h2.layoutGroupLabel {
    margin-top: 0;
  }
`;

const groupThemes: { [key: string]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {};

groupThemes.vrcGreen = css`
  background: ${props => props.theme.colors.ui.background3};
`;

groupThemes.vrcGrey = css`
  background: ${props => props.theme.colors.ui.background3};
`;
