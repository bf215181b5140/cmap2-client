import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { MouseEvent, useEffect, useReducer, useState } from 'react';
import { BackgroundDTO, InteractionKeyDTO, LayoutsPageSchema, ThemeDTO, TierDTO } from 'cmap2-shared';
import layoutsReducer from './layouts.reducer';
import { LayoutsPageContext, LayoutsPageData } from './layouts.context';
import { Page } from '../../../components/page/page.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';
import LayoutSection from './layout/layout.section';
import GroupSection from './group/group.section';
import ButtonSection from './button/button.section';
import LayoutsSection from './layoutsSelection/layoutsSelection.component';
import NoConnection from '../../../components/noConnection/noConnection.component';

export default function LayoutsPage() {

  const navigate = useNavigate();
  const { GET } = useCmapFetch();
  const { layoutId, groupId, buttonId } = useParams();
  const [tier, setTier] = useState<TierDTO | undefined>();
  const [background, setBackground] = useState<BackgroundDTO | undefined>();
  const [theme, setTheme] = useState<ThemeDTO | undefined>();
  const [interactionKeys, setInteractionKeys] = useState<InteractionKeyDTO[]>([]);
  const [layouts, layoutsDispatch] = useReducer(layoutsReducer, []);
  const [noConnection, setNoConnection] = useState<boolean>(false);

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => {
      setTier(data.tier);
      setBackground(data.background);
      setTheme(data.theme);
      setInteractionKeys(data.interactionKeys);
      layoutsDispatch({ type: 'setLayouts', layouts: data.layouts });
    }, () => setNoConnection(true));
  }, []);

  if (noConnection) return <NoConnection />;

  if (!tier || !background || !theme) return;

  const layout = layouts?.find(l => l.id === layoutId);
  const group = layout?.groups?.find(g => g.id === groupId);
  const button = group?.parameterButtons?.find(b => b.id === buttonId);

  const section = button || buttonId === 'new' ? 'button' : group || groupId === 'new' ? 'group' : layout || layoutId === 'new' ? 'layout' : 'layouts';

  const pageData: LayoutsPageData = {
    tier,
    background,
    theme: theme,
    interactionKeys,
    layouts,
    layoutsDispatch,
    layoutId,
    groupId,
    buttonId,
    layout,
    group,
    parameterButton: button
  };

  function onMenuItemClick(event: MouseEvent<HTMLElement>, path: string) {
    event.stopPropagation();
    navigate(path);
  }

  return (<Page flexDirection={'column'}>

    <PageMenu>
      {/* Layout */}
      <div onClick={event => onMenuItemClick(event, `/website/layouts/${layout?.id}`)}>
        {layout?.label || 'Layout'}
        {layouts.length > 0 && <div className={'PageMenuDropdown'}>
          <ul>
            {layouts.map(l =>
              <li key={l.id} onClick={event => onMenuItemClick(event, `/website/layouts/${l.id}`)}>{l.label}</li>
            )}
          </ul>
        </div>}
      </div>
    </PageMenu>

    <Routes>
      <Route path={'/'} element={<>layouts</>} />
      <Route path={'/:layoutId'} element={<>layout</>} />
      <Route path={'edit/layout/:layoutId'} element={<>editing layout</>} />
      <Route path={'edit/group/:layoutId/:groupId'} element={<>editing group</>} />
      <Route path={'edit/parameterButton/:layoutId/:groupId/:parameterButtonId'} element={<>editing parameter button</>} />
      <Route path={'edit/presetButton/:layoutId/:presetButtonId'} element={<>editing preset button</>} />
      <Route path={'edit/avatarButton/:avatarButtonId'} element={<>editing avatar button</>} />
    </Routes>

    <Link to={'/website/layouts'}>layouts</Link>
    <Link to={'/website/layouts/layoutId'}>layout</Link>
    <Link to={'/website/layouts/edit/layout/layoutId'}>editing layout</Link>
    <Link to={'/website/layouts/edit/group/layoutId/groupId'}>editing group</Link>
    <Link to={'/website/layouts/edit/parameterButton/layoutId/groupId/parameterButtonId'}>editing parameter button</Link>
    <Link to={'/website/layouts/edit/presetButton/layoutId/presetButtonId'}>editing preset button</Link>
    <Link to={'/website/layouts/edit/avatarButton/avatarButtonId'}>editing avatar button</Link>

    <LayoutsPageContext.Provider value={pageData}>

      <PageMenu>
        <div onClick={() => navigate('/website/layouts')} aria-current={section === 'layouts'}>Layouts</div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Layout */}
        <div onClick={event => onMenuItemClick(event, `/website/layouts/${layout?.id}`)} aria-current={section === 'layout'} aria-disabled={!layout}>
          {layout?.label || 'Layout'}
          {layouts.length > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {layouts.map(l =>
                <li key={l.id} onClick={event => onMenuItemClick(event, `/website/layouts/${l.id}`)}>{l.label}</li>
              )}
            </ul>
          </div>}
        </div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Group */}
        <div onClick={event => onMenuItemClick(event, `/website/layouts/${layout?.id}/${group?.id}`)} aria-current={section === 'group'} aria-disabled={!group}>
          {group?.label || 'Group'}
          {(layout?.groups?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {layout?.groups?.map((g, index) =>
                <li key={g.id} onClick={event => onMenuItemClick(event, `/website/layouts/${layout.id}/${g.id}`)}>{g.label || `Unnamed group ${index}`}</li>
              )}
            </ul>
          </div>}
        </div>

        <i className={'ri-arrow-right-s-line'} />

        {/* Button */}
        <div onClick={event => onMenuItemClick(event, `/website/layouts/${layout?.id}/${group?.id}/${button?.id}`)} aria-current={section === 'button'} aria-disabled={!button}>
          {button?.label || 'Button'}
          {(group?.parameterButtons?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
            <ul>
              {group?.parameterButtons?.map((b, index) =>
                <li key={b.id} onClick={event => onMenuItemClick(event, `/website/layouts/${layout?.id}/${group.id}/${b.id}`)}>{b.label || `Unnamed button ${index}`}</li>
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
