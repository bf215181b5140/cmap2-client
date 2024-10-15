import useCmapFetch from '../../../hooks/cmapFetch.hook';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDTO, LayoutsPageDTO, LayoutsPageSchema } from 'cmap2-shared';
import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';
import LayoutBreadcrumbs from './breadcrumbs/layoutBreadcrumbs.component';
import LayoutSection from './layout/layout.section';
import styled from 'styled-components';
import LayoutSettings from './layout/settings/settings.component';

export default function LayoutsPage() {

  // hooks
  const { GET } = useCmapFetch();
  const { layoutId, groupId, buttonId } = useParams();
  const navigate = useNavigate();

  // data
  const [client, setClient] = useState<LayoutsPageDTO | undefined>();
  const [addingLayout, setAddingLayout] = useState<boolean>(false);

  const layout = client?.layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);
  const section = button ? 'button' : group ? 'group' : layout ? 'layout' : 'layouts';

  const newLayout: LayoutDTO = {
    id: '',
    label: '',
    avatars: [],
    healthEnabled: false,
    healthMax: null,
    healthPath: null,
    useCostEnabled: false,
    useCostMax: null,
    useCostPath: null
  };

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => setClient(data));
  }, []);

  if (!client) return;

  const canAddLayout = client?.layouts.length < client?.tier.layouts;
  if (!canAddLayout && addingLayout) setAddingLayout(false);

  return (<Page flexDirection={'column'}>

    <LayoutBreadcrumbs layout={layout} group={group} button={button} />

    {section === 'button' && <>
      <Segment segmentTitle={'Preview'} width={'Third'}></Segment>
      <Segment segmentTitle={'Edit'} width={'Half'}></Segment>
    </>}

    {section === 'group' && <>
      <Segment segmentTitle={'Group'}></Segment>
    </>}

    {section === 'layout' && layout && <LayoutSection layout={layout} client={client} />}

    {section === 'button' && <>
      <Segment segmentTitle={'Preview'} width={'Third'}></Segment>
      <Segment segmentTitle={'Edit'} width={'Half'}></Segment>
    </>}

    {section === 'layouts' && <>
      <LayoutPicker>

        {client.layouts?.map(l => <div key={l.id} onClick={() => navigate('/website/layouts/' + l.id)}>
          <h2>{l.label}</h2>
          <div>{l.avatars.length} avatars</div>
          <div>{l.groups?.length || 0} groups</div>
          <div>{l.groups?.reduce((sum, g) => sum += (g.buttons?.length || 0), 0) || 0} buttons</div>
        </div>)}

        <div className={'addNew' + (addingLayout ? ' active' : '') + (!canAddLayout ? ' limitReached' : '')} onClick={() => setAddingLayout(!addingLayout)}>
          <i className={'ri-function-add-fill'} />
          <div>{client.layouts.length}/{client.tier.layouts}</div>
          <h2>{canAddLayout ? 'Add layout' : 'Limit reached'}</h2>
        </div>

      </LayoutPicker>
      {addingLayout && <LayoutSettings layout={newLayout} tier={client.tier} title={'Adding new layout'} />}
    </>}

  </Page>);
}

const LayoutPicker = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 0 20px;

  > div {
    width: 250px;
    min-height: 160px;
    background-color: ${props => props.theme.colors.ui.background3};
    border: 2px solid ${props => props.theme.colors.buttons.primary.border};
    transition: 0.1s linear;
    padding: 20px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;

    h2 {
      margin-top: 0;
      color: ${props => props.theme.colors.font.h3};
    }

    > div {
      margin: 5px;
    }

    :hover, &.active {
      border-color: ${props => props.theme.colors.buttons.primary.hoverBorder};
      transform: scale(1.05);
    }

    &.addNew {
      background: none;
      border-style: dashed;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      i {
        color: ${props => props.theme.colors.buttons.secondary.hoverBg};
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 50px;
      }
    }

    &.limitReached {
      border-color: ${props => props.theme.colors.error};
      color: ${props => props.theme.colors.error};
      pointer-events: none;
    }
  }
`;


