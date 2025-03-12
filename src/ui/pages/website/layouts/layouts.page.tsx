import { Route, Routes } from 'react-router-dom';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { useEffect, useReducer, useState } from 'react';
import { BackgroundDTO, InteractionKeyDTO, LayoutsPageSchema, ThemeDTO, TierDTO } from 'cmap2-shared';
import layoutsReducer from './reducers/layouts.reducer';
import { LayoutsPageContext, LayoutsPageData } from './layouts.context';
import LayoutPage from './layout/layout.page';
import EditGroupPage from './edit/group/editGroup.page';
import EditParameterButtonPage from './edit/parameterButton/editParameterButton.page';
import NoConnection from '../../../components/noConnection/noConnection.component';
import avatarButtonsReducer from './reducers/avatarButtons.reducer';
import EditLayoutPage from './edit/layout/editLayoutPage';
import EditPresetButtonPage from './edit/presetButton/editPresetButton.page';
import EditAvatarButtonPage from './edit/avatarButton/editAvatarButton.page';

export default function LayoutsPage() {

  const { GET } = useCmapFetch();

  const [tier, setTier] = useState<TierDTO | undefined>();
  const [background, setBackground] = useState<BackgroundDTO | undefined>();
  const [theme, setTheme] = useState<ThemeDTO | undefined>();
  const [layouts, layoutsDispatch] = useReducer(layoutsReducer, []);
  const [avatarButtons, avatarButtonsDispatch] = useReducer(avatarButtonsReducer, []);
  const [interactionKeys, setInteractionKeys] = useState<InteractionKeyDTO[]>([]);

  const [noConnection, setNoConnection] = useState<boolean>(false);

  useEffect(() => {
    GET('layouts', LayoutsPageSchema, (data) => {
      setTier(data.tier);
      setBackground(data.background);
      setTheme(data.theme);
      layoutsDispatch({ type: 'setLayouts', layouts: data.layouts });
      avatarButtonsDispatch({ type: 'setAvatarButtons', avatarButtons: data.avatarButtons });
      setInteractionKeys(data.interactionKeys);
    }, () => setNoConnection(true));
  }, []);

  if (noConnection) return <NoConnection />;

  if (!tier || !background || !theme) return;

  // const { layoutId, groupId, buttonId } = useParams();
  // const layout = layouts?.find(l => l.id === layoutId);
  // const group = layout?.groups?.find(g => g.id === groupId);
  // const button = group?.parameterButtons?.find(b => b.id === buttonId);

  const pageData: LayoutsPageData = {
    tier,
    background,
    theme,
    layouts,
    layoutsDispatch,
    avatarButtons,
    avatarButtonsDispatch,
    interactionKeys,
    setInteractionKeys,
  };

  return (<LayoutsPageContext.Provider value={pageData}>

    <Routes>
      {/* <Route path={''} element={<LayoutPage />} /> */}
      <Route path={':layoutId?'} element={<LayoutPage />} />
      <Route path={'edit/layout/:layoutId'} element={<EditLayoutPage />} />
      <Route path={'edit/group/:layoutId/:groupId'} element={<EditGroupPage />} />
      <Route path={'edit/parameterButton/:layoutId/:groupId/:parameterButtonId'} element={<EditParameterButtonPage />} />
      <Route path={'edit/presetButton/:layoutId/:presetButtonId'} element={<EditPresetButtonPage />} />
      <Route path={'edit/avatarButton/:avatarButtonId'} element={<EditAvatarButtonPage />} />
    </Routes>

    </LayoutsPageContext.Provider>);
}
