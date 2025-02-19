import { useNavigate } from 'react-router-dom';
import { MouseEvent, useContext, useState } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { QuickEditItem } from './quickEditToolbar/quickEditToolbar.model';
import { ButtonDTO, GroupDTO, LayoutDTO } from 'cmap2-shared';
import QuickEditToolbar from './quickEditToolbar/quickEditToolbar.component';
import { Layout } from 'cmap2-shared/react';
import { LayoutGroup } from 'cmap2-shared/react';
import { LayoutButton } from 'cmap2-shared/react';
import AddCounter from '../../../../../components/addCounter/addCounter.component';
import styled from 'styled-components';
import Background from '../../../../../components/background/background.component';

export default function LayoutPreview() {

  const navigate = useNavigate();
  const { tier, background, theme, layout } = useContext(LayoutsPageContext);
  const [mode, setMode] = useState<'edit' | 'simulate'>('edit');
  const [activeItem, setActiveItem] = useState<QuickEditItem | undefined>();

  if (!layout) return;

  function canAddGroup(layout: LayoutDTO) {
    return (layout.groups?.length || 0) < tier.groups;
  }

  function canAddButton(group: GroupDTO) {
    return (group.buttons?.length || 0) < tier.buttons;
  }

  function onGroupClick(event: MouseEvent<HTMLDivElement>, group?: GroupDTO) {
    if (!group) {
      navigate(`/website/layouts/${layout?.id}/new`);
    } else {
      if (event.detail > 1) {
        navigate(`/website/layouts/${layout?.id}/${group?.id}`);
      } else {
        setActiveItem({ type: 'group', groupId: group.id });
      }
    }
  }

  function onButtonClick(event: MouseEvent<HTMLDivElement>, group: GroupDTO, button?: ButtonDTO) {
    event.stopPropagation();
    if (!button) {
      navigate(`/website/layouts/${layout?.id}/${group?.id}/new`);
    } else {
      if (event.detail > 1) {
        navigate(`/website/layouts/${layout?.id}/${group.id}/${button.id}`);
      } else {
        setActiveItem({ type: 'button', groupId: group.id, buttonId: button.id });
      }
    }
  }

  return (<LayoutPreviewStyled>
    <PreviewBackground background={background}>

      <QuickEditToolbar item={activeItem} />

      <div style={{ height: '100px' }} />

      <Layout>

        {/* Groups */}
        {layout?.groups?.map(group => (
          <LayoutGroup key={group.id} theme={theme} group={group} onClick={event => onGroupClick(event, group)}>

            {/* Buttons */}
            {group.buttons?.map(button => (
              <LayoutButton key={button.id} theme={theme} button={button} onClick={event => onButtonClick(event, group, button)} />
            ))}

            {/* Add Button */}
            <div onClick={event => onButtonClick(event, group)} className={'newItem'} aria-disabled={!canAddButton(group)}>
              {/* <i className={'ri-function-add-fill'} /> */}
              <AddCounter canAddMore={canAddButton(group)}>{group.buttons?.length || 0}/{tier.buttons}</AddCounter>
              {canAddButton(group) ? 'Add button' : 'Limit reached'}
            </div>

          </LayoutGroup>
        ))}

        {/* Add Group */}
        <div onClick={event => onGroupClick(event)} className={'newItem'} aria-disabled={!canAddGroup(layout)}>
          <i className={'ri-function-add-fill'} />
          <AddCounter canAddMore={canAddGroup(layout)}>{layout.groups?.length || 0}/{tier.groups}</AddCounter>
          {canAddGroup(layout) ? 'Add group' : 'Limit reached'}
        </div>

      </Layout>

    </PreviewBackground>
  </LayoutPreviewStyled>);
}

const LayoutPreviewStyled = styled.div`
  border: 4px solid ${props => props.theme.colors.ui.background3};
  background: ${props => props.theme.colors.ui.background3};
  border-radius: 8px;

  div.newItem {
    border: 2px dashed ${props => props.theme.colors.ui.element2};
    padding: 30px;
    border-radius: 8px;
    flex: 100%;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: 0.1s linear;
    pointer-events: auto;

    i {
      color: ${props => props.theme.colors.success};
      position: absolute;
      top: 24px;
      right: 30px;
      font-size: 30px;
    }

    :hover {
      border-color: ${props => props.theme.colors.ui.element5};

      > i {
        color: ${props => props.theme.colors.ui.element5};
      }
    }

    &[aria-disabled='true'] {
      pointer-events: none;
      border: none;
      padding: 10px;

      > i {
        display: none;
      }
    }
  }
`;

const PreviewBackground = styled(Background)`
  padding: 40px;
  padding-top: 0;
  border-radius: 6px;
`;

const NewGroup = styled.div`
  border: 4px dashed ${props => props.theme.colors.ui.background3};
`;