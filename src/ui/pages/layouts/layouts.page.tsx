import { useNavigate, useParams } from 'react-router-dom';
import useCmapFetch from '../../hooks/cmapFetch.hook';
import { MouseEvent, useEffect, useReducer, useState } from 'react';
import { BackgroundDTO, InteractionKeyDTO, LayoutsPageSchema, StyleDTO, TierDTO } from 'cmap2-shared';
import layoutsReducer from './layouts.reducer';
import { LayoutsPageContext, LayoutsPageData } from './layouts.context';
import { Page } from '../../components/page/page.component';
import PageMenu from '../../components/menu/pageMenu/pageMenu.component';
import LayoutSection from './layout/layout.section';
import GroupSection from './group/group.section';
import ButtonSection from './button/button.section';
import LayoutsSection from './layouts/layouts.section';
import NoConnection from '../../components/noConnection/noConnection.component';

export default function LayoutsPage() {

  const navigate = useNavigate();
  const { GET } = useCmapFetch();
  const { layoutId, groupId, buttonId } = useParams();
  const [tier, setTier] = useState<TierDTO | undefined>();
  const [background, setBackground] = useState<BackgroundDTO | undefined>();
  const [style, setStyle] = useState<StyleDTO | undefined>();
  const [interactionKeys, setInteractionKeys] = useState<InteractionKeyDTO[]>([]);
  const [layouts, layoutsDispatch] = useReducer(layoutsReducer, []);
  const [noConnection, setNoConnection] = useState<boolean>(false);

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => {
      setTier(data.tier);
      setBackground(data.background);
      setStyle(data.style);
      setInteractionKeys(data.interactionKeys);
      layoutsDispatch({ type: 'setLayouts', layouts: data.layouts });
    }, () => setNoConnection(true));
  }, []);

  if (noConnection) return <NoConnection />;

  if (!tier || !background || !style) return;

  const layout = layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.buttons?.find(b => b.id === buttonId);

  const section = button || buttonId === 'new' ? 'button' : group || groupId === 'new' ? 'group' : layout || layoutId === 'new' ? 'layout' : 'layouts';

  const pageData: LayoutsPageData = {
    tier,
    background,
    style,
    interactionKeys,
    layouts,
    layoutsDispatch,
    layoutId,
    groupId,
    buttonId,
    layout,
    group,
    button
  }

  function onMenuItemClick(event: MouseEvent<HTMLElement>, path: string) {
    event.stopPropagation();
    navigate(path);
  }

  return (<Page flexDirection={'column'}>
    <LayoutsPageContext.Provider value={pageData}>

      <PageMenu>
        <div onClick={() => navigate('/layouts')} aria-current={section === 'layouts'}>Layouts</div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Layout */}
        <div onClick={event => onMenuItemClick(event, `/layouts/${layout?.id}`)} aria-current={section === 'layout'} aria-disabled={!layout}>
          {layout?.label || 'Layout'}
          {layouts.length > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {layouts.map(l =>
                <li key={l.id} onClick={event => onMenuItemClick(event, `/layouts/${l.id}`)}>{l.label}</li>
              )}
            </ul>
          </div>}
        </div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Group */}
        <div onClick={event => onMenuItemClick(event, `/layouts/${layout?.id}/${group?.id}`)} aria-current={section === 'group'} aria-disabled={!group}>
          {group?.label || 'Group'}
          {(layout?.groups?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {layout?.groups?.map((g, index) =>
                <li key={g.id} onClick={event => onMenuItemClick(event, `/layouts/${layout.id}/${g.id}`)}>{g.label || `Unnamed group ${index}`}</li>
              )}
            </ul>
          </div>}
        </div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Button */}
        <div onClick={event => onMenuItemClick(event, `/layouts/${layout?.id}/${group?.id}/${button?.id}`)} aria-current={section === 'button'} aria-disabled={!button}>
          {button?.label || 'Button'}
          {(group?.buttons?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {group?.buttons?.map((b, index) =>
                <li key={b.id} onClick={event => onMenuItemClick(event, `/layouts/${layout?.id}/${group.id}/${b.id}`)}>{b.label || `Unnamed button ${index}`}</li>
              )}
            </ul>
          </div>}
        </div>
      </PageMenu>

      {section === 'layout' && <LayoutSection />}

      {section === 'group' && <GroupSection />}

      {section === 'button' && <ButtonSection />}

      {section === 'layouts' && <LayoutsSection />}

    </LayoutsPageContext.Provider>
  </Page>);
}
