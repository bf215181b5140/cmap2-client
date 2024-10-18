import React, { useContext, useState } from 'react';
import Section from '../../../../components/section/section.component';
import SectionMenu from '../../../../components/menu/sectionMenu/sectionMenu.component';
import LayoutSettings from './settings/settings.component';
import LayoutPreview from './preview/layoutPreview.component';
import ParameterBadges from './parameterBadges/parameterBadges.component';
import ControlParamters from './controlParameters/controlParameters.component';
import { LayoutsPageContext } from '../layouts.context';

type LayoutSegments = 'preview' | 'Settings' | 'parameterBadges' | 'controlParameters';

export default function LayoutSection() {

  const [segment, setSegment] = useState<LayoutSegments>('preview');
  const { layout } = useContext(LayoutsPageContext);

  if (!layout) return;

  return (<Section>
    <SectionMenu>
      <div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('preview')} aria-current={segment === 'preview'}>Preview</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('Settings')} aria-current={segment === 'Settings'}>Settings</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('parameterBadges')} aria-current={segment === 'parameterBadges'}>Parameter badges</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('controlParameters')} aria-current={segment === 'controlParameters'}>Control parameters</div>
      </div>
    </SectionMenu>

    {segment === 'preview' && <LayoutPreview />}
    {segment === 'Settings' && <LayoutSettings editLayout={layout} />}
    {segment === 'parameterBadges' && <ParameterBadges />}
    {segment === 'controlParameters' && <ControlParamters />}

  </Section>);
}
