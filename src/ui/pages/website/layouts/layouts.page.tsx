import useCmapFetch from '../../../hooks/cmapFetch.hook';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDTO, LayoutsPageDTO, LayoutsPageSchema } from 'cmap2-shared';
import { Page } from '../../../components/page/page.component';
import Segment from '../../../components/segment/segment.component';
import LayoutSection from './layout/layout.section';
import styled from 'styled-components';
import LayoutForm from './layout/form/layoutForm.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';
import { useLayoutsPage } from './layouts.hook';
import { LayoutsPageContext } from './layouts.context';
import GroupSection from './group/group.section';
import ButtonSection from './button/button.section';
import LayoutsSection from './layouts/layouts.section';

export default function LayoutsPage() {

  // hooks
  const { GET } = useCmapFetch();
  const navigate = useNavigate();
  const [client, setClient] = useState<LayoutsPageDTO | undefined>();

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => setClient(data));
  }, []);

  if (!client) return;

  const LayoutsPageHook = useLayoutsPage(client);
  const { layouts, section, layout, group, button } = LayoutsPageHook;

  return (<Page flexDirection={'column'}>
    <LayoutsPageContext.Provider value={LayoutsPageHook}>

      <PageMenu>
        <div onClick={() => navigate('/website/layouts')} aria-current={section === 'layouts'}>Layouts</div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Layout */}
        <div aria-current={section === 'layout'} aria-disabled={!layout}>
          {layout?.label || 'Layout'}
          {layouts.length > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {layouts.map(l =>
                <li key={l.id} onClick={() => navigate(`/website/layouts/${l.id}`)}>{l.label}</li>
              )}
            </ul>
          </div>}
        </div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Group */}
        <div aria-current={section === 'group'} aria-disabled={!group}>
          {group?.label || 'Group'}
          {(layout?.groups?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {layout?.groups?.map((g, index) =>
                <li key={g.id} onClick={() => navigate(`/website/layouts/${layout.id}/${g.id}`)}>{g.label || `Unnamed group ${index}`}</li>
              )}
            </ul>
          </div>}
        </div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Button */}
        <div aria-current={section === 'button'} aria-disabled={!button}>
          {button?.label || 'Button'}
          {(group?.buttons?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {group?.buttons?.map((b, index) =>
                <li key={b.id} onClick={() => navigate(`/website/layouts/${layout?.id}/${group.id}/${b.id}`)}>{b.label || `Unnamed button ${index}`}</li>
              )}
            </ul>
          </div>}
        </div>
      </PageMenu>

      {section === 'layout' && layout && <LayoutSection />}

      {section === 'group' && group && <GroupSection />}

      {section === 'button' && button && <ButtonSection />}

      {section === 'layouts' && <LayoutsSection />}

    </LayoutsPageContext.Provider>
  </Page>);
}
