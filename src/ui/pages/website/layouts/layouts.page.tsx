import useCmapFetch from '../../../hooks/cmapFetch.hook';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDTO, LayoutsPageDTO, LayoutsPageSchema } from 'cmap2-shared';
import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';
import LayoutSection from './layout/layout.section';
import styled from 'styled-components';
import LayoutSettings from './layout/settings/settings.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';
import { useLayoutsPage } from './layouts.hook';
import { LayoutsPageContext } from './layouts.context';
import GroupSection from './group/group.section';
import ButtonSection from './button/button.section';
import LayoutsSection from './layouts/layouts.section';

export default function LayoutsPage() {

  // hooks
  const { GET } = useCmapFetch();
  const { layoutId, groupId, buttonId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<LayoutsPageDTO | undefined>();

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => setClient(data));
  }, []);

  if (!client) return;

  const layout = client?.layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);
  const section = button ? 'button' : group ? 'group' : layout ? 'layout' : 'layouts';

  const LayoutsPageHook = useLayoutsPage(client, () => {});

  return (<Page flexDirection={'column'}>
    <LayoutsPageContext.Provider value={LayoutsPageHook}>

      <PageMenu>
        <div onClick={() => navigate('/website/layouts')} aria-current={section === 'layouts'}>Layouts</div>
        <i className={'ri-arrow-right-s-line'} />
        <div aria-current={section === 'layout'} aria-disabled={!layout}>
          {layout?.label || 'Layout'}
          {client.layouts.length > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {client.layouts.map(l => <li key={l.id} onClick={() => navigate('/website/layouts/' + l.id)}>{l.label}</li>)}
            </ul>
          </div>}
        </div>
        <i className={'ri-arrow-right-s-line'} />
        <div onClick={() => navigate(`/website/layouts/${layout?.id}/${group?.id}`)} aria-current={section === 'group'}
             aria-disabled={!group}>{group?.label || 'Group'}</div>
        <i className={'ri-arrow-right-s-line'} />
        <div onClick={() => navigate(`/website/layouts/${layout?.id}/${group?.id}/${button?.id}`)} aria-current={section === 'button'}
             aria-disabled={!button}>{button?.label || 'Button'}</div>
      </PageMenu>

      {section === 'layout' && layout && <LayoutSection />}

      {section === 'group' && group && <GroupSection />}

      {section === 'button' && button && <ButtonSection />}

      {section === 'layouts' && <LayoutsSection />}

    </LayoutsPageContext.Provider>
  </Page>);
}
