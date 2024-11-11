import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { GroupDTO, GroupWidth, StyleDTO } from 'cmap2-shared';
import { ReactProps } from '../../../types';
import { MouseEvent } from 'react';
import { LAYOUT_ELEMENT_GAP } from '../layout/layout.component';

interface LayoutGroupProps extends ReactProps {
  style: StyleDTO;
  group: GroupDTO;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function LayoutGroup({ style, group, onClick, children }: LayoutGroupProps) {

  const readonly = !onClick;

  return (<LayoutGroupStyled style={style} width={group.width} onClick={onClick} aria-readonly={readonly}>
    {group.showLabel && <h2 className={'layoutGroupLabel'}>{group.label}</h2>}
    <div className={'layoutButtonWrapper'}>
      {children}
    </div>
  </LayoutGroupStyled>);
}

const LayoutGroupStyled = styled.div.attrs(() => ({ className: 'layoutGroup' }))<{ style: StyleDTO, width: GroupWidth }>`
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

  ${props => groupStyles[props.style.id]};
  
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

const groupStyles: { [key: string]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {};

groupStyles.vrcGreen = css`
  background: ${props => props.theme.colors.ui.background3};
`;

groupStyles.vrcGrey = css`
  background: ${props => props.theme.colors.ui.background3};
`;
