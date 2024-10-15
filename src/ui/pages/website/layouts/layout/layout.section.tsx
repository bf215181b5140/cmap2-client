import { ClientDTO, LayoutDTO, LayoutsPageDTO } from 'cmap2-shared';
import React, { useState } from 'react';
import { PageMenuSelect } from '../../../../components/menu/pageMenu/pageMenuSelect.component';
import PageMenuLink from '../../../../components/menu/pageMenu/pageMenuLink.component';
import styled from 'styled-components';
import { PAGE_ELEMENT_GAP } from '../../../../components/page/page.component';
import Section from '../../../../components/section/section.component';

interface LayoutProps {
  layout: LayoutDTO;
  client: LayoutsPageDTO;
}

type LayoutSegments = 'preview' | 'basicInfo' | 'parameterBadges' | 'controlParameters';

export default function LayoutSection({ layout, client }: LayoutProps) {

  const [segment, setSegment] = useState<LayoutSegments>('preview');

  return (<Section>
    <Menu>
      <div>
        <PageMenuSelect>
          {client.layouts?.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </PageMenuSelect>

        <hr />

        <PageMenuLink onClick={() => setSegment('preview')} isActive={segment === 'preview'}>Preview</PageMenuLink>
        <PageMenuLink onClick={() => setSegment('basicInfo')} isActive={segment === 'basicInfo'}>Basic info</PageMenuLink>
        <PageMenuLink onClick={() => setSegment('parameterBadges')} isActive={segment === 'parameterBadges'}>Parameter badges</PageMenuLink>
        <PageMenuLink onClick={() => setSegment('controlParameters')} isActive={segment === 'controlParameters'}>Control parameters</PageMenuLink>
      </div>
    </Menu>
  </Section>);
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
    // margin-top: -${PAGE_ELEMENT_GAP};

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
