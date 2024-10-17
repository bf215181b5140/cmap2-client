import { LayoutDTO, LayoutsPageDTO } from 'cmap2-shared';
import React, { useState } from 'react';
import Section from '../../../../components/section/section.component';
import SectionMenu from '../../../../components/menu/sectionMenu/sectionMenu.component';
import { SelectInputStyled } from '../../../../components/input/input.style';

interface LayoutProps {
  layout: LayoutDTO;
  client: LayoutsPageDTO;
}

type LayoutSegments = 'preview' | 'basicInfo' | 'parameterBadges' | 'controlParameters';

export default function LayoutSection({ layout, client }: LayoutProps) {

  const [segment, setSegment] = useState<LayoutSegments>('preview');

  return (<Section>
    <SectionMenu>
      <div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('preview')} aria-current={segment === 'preview'}>Preview</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('basicInfo')} aria-current={segment === 'basicInfo'}>Basic info</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('parameterBadges')} aria-current={segment === 'parameterBadges'}>Parameter badges</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('controlParameters')} aria-current={segment === 'controlParameters'}>Control parameters</div>
      </div>
    </SectionMenu>
  </Section>);
}
