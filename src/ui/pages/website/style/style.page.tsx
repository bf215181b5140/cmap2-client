import React, { useEffect, useState } from 'react';
import { Page } from '../../../components/page/page.component';
import BackgroundPicker from '../style/background/backgroundPicker.component';
import StylePicker from '../style/theme/themePicker.component';
import NoConnection from '../../../components/noConnection/noConnection.component';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { BackgroundDTO, StylePageDTO, StylePageSchema, ThemeDTO } from 'cmap-shared';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';

export default function StylePage() {

  const { GET } = useCmapFetch();
  const [stylesData, setStylesData] = useState<StylePageDTO | undefined | null>();
  const [section, setSection] = useState<'background' | 'theme'>('background');

  useEffect(() => {
    GET('style', StylePageSchema, data => setStylesData(data), () => setStylesData(null));
  }, []);

  function setBackground(background: BackgroundDTO) {
    setStylesData(prevState => {
      if (!prevState) return undefined;
      prevState.client.background = background;
      return { ...prevState };
    });
  }

  function setTheme(theme: ThemeDTO) {
    setStylesData(prevState => {
      if (!prevState) return undefined;
      prevState.client.theme = theme;
      return { ...prevState };
    });
  }

  if (stylesData === undefined) return;

  if (stylesData === null) return <NoConnection />;

  return (<Page flexDirection={'column'}>

    <PageMenu>
      <div onClick={() => setSection('background')} aria-current={section === 'background'}>Background</div>
      <div onClick={() => setSection('theme')} aria-current={section === 'theme'}>Theme</div>
    </PageMenu>

    {section === 'background' && <BackgroundPicker stylesData={stylesData} setBackground={setBackground} />}

    {section === 'theme' && <StylePicker stylesData={stylesData} setTheme={setTheme} />}

  </Page>);
}

