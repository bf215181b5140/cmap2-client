import styled from 'styled-components';
import { ButtonDTO, GroupDTO, LayoutDTO } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';

interface LayoutBreadcrumbsProps {
  layout: LayoutDTO | undefined;
  group: GroupDTO | undefined;
  button: ButtonDTO | undefined;
}

export default function LayoutBreadcrumbs({ layout, group, button }: LayoutBreadcrumbsProps) {

   const navigate = useNavigate();

  function activePage() {
    if (button) return 'button';
    if (group) return 'group';
    if (layout) return 'layout';
    return undefined;
  }

  return (<LayoutBreadcrumbsStyled>

    <BreadcrumbItem onClick={() => navigate('/website/layouts')} active={!activePage()} selectable={true}>Layouts</BreadcrumbItem>

    <i className={'ri-arrow-right-s-line'} />

    <BreadcrumbItem onClick={() => navigate(`/website/layouts/${layout?.id}`)} active={activePage() === 'layout'} selectable={!!layout}>{layout?.label || 'Layout'}</BreadcrumbItem>

    <i className={'ri-arrow-right-s-line'} />

    <BreadcrumbItem onClick={() => navigate(`/website/layouts/${layout?.id}/${group?.id}`)} active={activePage() === 'group'} selectable={!!group}>{group?.label || 'Group'}</BreadcrumbItem>

    <i className={'ri-arrow-right-s-line'} />

    <BreadcrumbItem onClick={() => navigate(`/website/layouts/${layout?.id}/${group?.id}/${button?.id}`)} active={activePage() === 'button'} selectable={!!button}>{button?.label || 'Button'}</BreadcrumbItem>

  </LayoutBreadcrumbsStyled>);
}

const LayoutBreadcrumbsStyled = styled.div`
  margin-top: -20px;
  border-radius: 0 0 8px 8px;
  padding: 0 25px;
  background-color: ${props => props.theme.colors.segment.bg};
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  text-align: center;

  > i {
    color: ${props => props.theme.colors.font.textInactive};
    font-size: 20px;
  }
`;

const BreadcrumbItem = styled.div<{ active: boolean, selectable: boolean }>`
  cursor: pointer;
  flex: 1;
  padding: 12px;
  color: ${props => props.theme.colors.font.text};
  border-bottom: 2px solid ${props => props.theme.colors.ui.background3};

  ${props => props.active && `
    color: ${props.theme.colors.font.textActive};
    border-bottom: 2px solid ${props.theme.colors.font.textActive};
  `}

  ${props => !props.selectable && `
    color: ${props.theme.colors.font.textInactive};
    pointer-events: none;
  `}

  :hover {
    color: ${props => props.theme.colors.font.textActive};
    border-bottom: 2px solid ${props => props.theme.colors.font.textActive};
  }
`;