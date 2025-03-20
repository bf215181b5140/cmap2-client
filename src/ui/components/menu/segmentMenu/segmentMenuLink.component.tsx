import styled from 'styled-components';
import { ReactProps } from '../../../types';

interface SegmentMenuLinkProps extends ReactProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
}

export default function SegmentMenuLink({ onClick, active, disabled, icon, children }: SegmentMenuLinkProps) {

  return (<SegmentMenuLinkStyled onClick={onClick} data-active={!!active} data-disabled={!!disabled}>
    {icon && <i className={icon}></i>}
    {children}
  </SegmentMenuLinkStyled>);
}

const SegmentMenuLinkStyled = styled.div`
    margin: 0;
    padding: 0 24px 6px 24px;
    text-align: center;
    align-content: center;
    cursor: pointer;
    color: ${props => props.theme.colors.segmentMenu.color};
    border-bottom: 2px solid ${props => props.theme.colors.segmentMenu.color};
    
    i {
        margin-right: 5px;
    }

    :hover, &[data-active='true'] {
        color: ${props => props.theme.colors.segmentMenu.active};
        border-color: ${props => props.theme.colors.segmentMenu.active};
    }

    &[data-disabled='true'] {
        pointer-events: none;
        color: ${props => props.theme.colors.segmentMenu.disabled};
        border-color: ${props => props.theme.colors.segmentMenu.disabled};
        filter: saturate(0%);
    }
`;