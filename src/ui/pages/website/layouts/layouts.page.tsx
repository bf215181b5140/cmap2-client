import useCmapFetch from '../../../hooks/cmapFetch.hook';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutDTO, LayoutsPageDTO, LayoutsPageSchema } from 'cmap2-shared';
import { Page, PAGE_ELEMENT_GAP } from '../../../components/page/page.component';
import LayoutSettings from './layout/settings/settings.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';
import PageMenuLink from '../../../components/menu/pageMenu/pageMenuLink.component';
import Segment from '../../../components/segment/segment.component';
import { PageMenuSelect } from '../../../components/menu/pageMenu/pageMenuSelect.component';
import { QuickEditItem } from './quickEditToolbar/quickEditToolbar.model';
import QuickEditToolbar from './quickEditToolbar/quickEditToolbar.component';
import TextButton from '../../../components/buttons/textButton.component';
import styled, { css } from 'styled-components';

type LayoutSections = 'settings' | 'parameterBadges' | 'controlParameters' | 'preview' | 'button';

export default function LayoutsPage() {

  // hooks
  const { GET } = useCmapFetch();
  const { layoutId, groupId, buttonId } = useParams();

  // data
  const [client, setClient] = useState<LayoutsPageDTO | undefined>();
  const layout = client?.layouts?.find(l => l.id === layoutId) || client?.layouts[0];
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);

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

  // section
  const [section, setSection] = useState<LayoutSections>('settings');
  const pageFlexDirection = section === 'button' ? 'row' : 'column';

  const [quickEditItem, setQuickEditItem] = useState<QuickEditItem | undefined>();

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => setClient(data));
  }, []);

  if (!client) return;

  return (<Page flexDirection={pageFlexDirection}>

    <Menu>
      <div>
        <PageMenuSelect>
          {client.layouts.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </PageMenuSelect>

        <hr />

        <PageMenuLink onClick={() => setSection('settings')} isActive={section === 'settings'}>Settings</PageMenuLink>
        <PageMenuLink onClick={() => setSection('parameterBadges')} isActive={section === 'parameterBadges'}>Parameter badges</PageMenuLink>
        <PageMenuLink onClick={() => setSection('controlParameters')} isActive={section === 'controlParameters'}>Control parameters</PageMenuLink>
        <PageMenuLink onClick={() => setSection('preview')} isActive={section === 'preview'}>Preview</PageMenuLink>
      </div>
    </Menu>

    {section === 'settings' && <LayoutSettings tier={client?.tier} layout={layout || newLayout} />}

    {section === 'parameterBadges' && <>
      <Segment segmentTitle={'Parameter badges'}></Segment>
    </>}

    {section === 'controlParameters' && <>
      <Segment segmentTitle={'Control parameters'}></Segment>
    </>}

    {section === 'button' && <>
      <Segment segmentTitle={'Preview'} width={'Third'}></Segment>
      <Segment segmentTitle={'Edit'} width={'Half'}></Segment>
    </>}

    {section === 'preview' && <>
      <Segment segmentTitle={'Preview'}>
        <TextButton text={'Item 1'} onClick={() => setQuickEditItem(state => state?.groupId === 'item1' ? undefined : { groupId: 'item1' })} />
        <TextButton text={'Item 2'} onClick={() => setQuickEditItem(state => state?.groupId === 'item2' ? undefined : { groupId: 'item2' })} />
        <TextButton text={'Item 3'} onClick={() => setQuickEditItem(state => state?.groupId === 'item3' ? undefined : { groupId: 'item3' })} />

        {quickEditItem && <>
          <QuickEditToolbar client={client} item={quickEditItem} />
        </>}
      </Segment>
    </>}

  </Page>);
}

const Menu = styled.div<{ noMarginTop?: boolean }>`
  width: 100%;
  background-color: ${props => props.theme.colors.ui.background3};
  border-radius: 0 0 8px 8px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: -${PAGE_ELEMENT_GAP};

  > div {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;

    hr {
      border: 1px solid ${props => props.theme.colors.submenu.bg};
      height: 30px;
    }
  }
`;

