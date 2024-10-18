import React, { useContext, useState } from 'react';
import Section from '../../../../components/section/section.component';
import SectionMenu from '../../../../components/menu/sectionMenu/sectionMenu.component';
import LayoutForm from './form/layoutForm.component';
import LayoutPreview from './preview/layoutPreview.component';
import ParameterBadges from './parameterBadges/parameterBadges.component';
import ControlParamters from './controlParameters/controlParameters.component';
import { LayoutsPageContext } from '../layouts.context';

type LayoutSegments = 'preview' | 'settings' | 'parameterBadges' | 'controlParameters';

export default function LayoutSection() {

  const [segment, setSegment] = useState<LayoutSegments>('preview');
  const { layout, newLayout } = useContext(LayoutsPageContext);

  if (!layout && segment !== 'settings') setSegment('settings');

  return (<Section>
    <SectionMenu>
      <div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('preview')} aria-current={segment === 'preview'} aria-disabled={!layout}>Preview</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('settings')} aria-current={segment === 'settings'}>Settings</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('parameterBadges')} aria-current={segment === 'parameterBadges'} aria-disabled={!layout}>Parameter badges</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('controlParameters')} aria-current={segment === 'controlParameters'} aria-disabled={!layout}>Control parameters</div>
      </div>
    </SectionMenu>

    {segment === 'preview' && <LayoutPreview />}
    {segment === 'settings' && <LayoutForm editLayout={layout || newLayout} />}
    {segment === 'parameterBadges' && <ParameterBadges />}
    {segment === 'controlParameters' && <ControlParamters />}

  </Section>);
}
