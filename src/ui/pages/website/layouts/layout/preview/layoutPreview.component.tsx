import styled from 'styled-components';
import Background from '../../../../../components/background/background.component';
import { useContext, useState, MouseEvent } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import Layout from '../../../../../components/preview/layout/layout.component';
import LayoutGroup from '../../../../../components/preview/group/layoutGroup.component';
import LayoutButton from '../../../../../components/preview/button/layoutButton.component';
import { ButtonDTO, GroupDTO, LayoutDTO } from 'cmap2-shared';
import { useNavigate } from 'react-router-dom';

export default function LayoutPreview() {

  const navigate = useNavigate();
  const { tier, background, style, layout } = useContext(LayoutsPageContext);
  const [mode, setMode] = useState<'edit' | 'simulate'>('edit');

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
      navigate(`/website/layouts/${layout?.id}/${group?.id}`);
    }
  }

  if (!layout) return;

  function onButtonClick(event: MouseEvent<HTMLDivElement>, group: GroupDTO, button?: ButtonDTO) {
    if (!button) {
      navigate(`/website/layouts/${layout?.id}/${group?.id}/new`);
    } else {

    }
  }


  return (<LayoutPreviewStyled>
      <Background background={background} />
      {mode}

      <Layout>
        {layout?.groups?.map(group => (
          <LayoutGroup onClick={event => onGroupClick(event, group)}>
            {group.buttons?.map(button => (
              <LayoutButton onClick={event => onButtonClick(event, group, button)} height={'140px'}>

              </LayoutButton>
            ))}

            <div onClick={event => onButtonClick(event, group)} className={'newItem'} aria-disabled={!canAddButton(group)}>
              <i className={'ri-function-add-fill'} />
              <div>{group.buttons?.length}/{tier.buttons}</div>
              <h2>{canAddButton(group) ? 'Add button' : 'Limit reached'}</h2>
            </div>

          </LayoutGroup>
        ))}

        <div onClick={event => onGroupClick(event)} className={'newItem'} aria-disabled={!canAddGroup(layout)}>
          <i className={'ri-function-add-fill'} />
          <div>{layout.groups?.length}/{tier.groups}</div>
          <h2>{canAddGroup(layout) ? 'Add group' : 'Limit reached'}</h2>
        </div>

      </Layout>

    </LayoutPreviewStyled>
  );
}

const LayoutPreviewStyled = styled.div`
  position: relative;
  border: 3px solid ${props => props.theme.colors.ui.background3};
  border-radius: 8px;
  overflow: hidden;
  padding: 40px;
  padding-top: 150px;

  > div:not(:first-child) {
    position: relative;
    background: ${props => props.theme.colors.ui.appBgOpaque};
    border-radius: 8px;
  }

  div.newItem {
    padding: 20px;
    background: none;
    border-style: dashed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    i {
      color: ${props => props.theme.colors.buttons.secondary.hoverBg};
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 50px;
    }
  }

`;