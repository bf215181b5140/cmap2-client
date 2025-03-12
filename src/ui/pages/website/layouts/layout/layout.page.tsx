import { useContext, useEffect, useState } from 'react';
import { LayoutsPageContext } from '../layouts.context';
import Presets from './presets/presets.component';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InteractionKeys from './interactionKeys/interactionKeys.component';
import Avatars from './avatars/avatars.component';
import Parameters from './parameters/parameters.component';
import LayoutHeader from './header/layoutHeader.component';
import { Page } from '../../../../components/page/page.component';

type LayoutSections = 'parameters' | 'presets' | 'avatars' | 'interactionKeys';

export default function LayoutPage() {

  const navigate = useNavigate();
  const [section, setSection] = useState<LayoutSections | undefined>();
  const { layouts } = useContext(LayoutsPageContext);
  const { layoutId } = useParams();
  const layout = layouts?.find(l => l.id === layoutId);

  if (!section && layout) setSection('parameters');

  useEffect(() => {
    if (layouts[0] && !layoutId) navigate(`/website/layouts/${layouts[0].id}`);
  }, []);

  return (<Page flexDirection={'column'}>

    <LayoutHeader layout={layout} />

    <LayoutMenuStyled>

      <LayoutMenuLinkStyled onClick={() => setSection('parameters')} aria-current={section === 'parameters'} aria-disabled={!layout}>
        <i className={'ri-layout-masonry-fill'} />
        Parameters
      </LayoutMenuLinkStyled>

      {<LayoutMenuLinkStyled onClick={() => setSection('presets')} aria-current={section === 'presets'} aria-disabled={!layout}>
        <i className={'ri-file-list-2-line'} />
        Presets
      </LayoutMenuLinkStyled>}

      <LayoutMenuLinkStyled onClick={() => setSection('avatars')} aria-current={section === 'avatars'}>
        <i className={'ri-group-line'} />
        Avatars
      </LayoutMenuLinkStyled>

      <LayoutMenuLinkStyled onClick={() => setSection('interactionKeys')} aria-current={section === 'interactionKeys'}>
        <i className={'ri-key-2-line'} />
        Interaction keys
      </LayoutMenuLinkStyled>

    </LayoutMenuStyled>

    {(section === 'parameters' && layout) && <Parameters layout={layout} />}
    {(section === 'presets' && layout) && <Presets layout={layout} />}
    {section === 'avatars' && <Avatars />}
    {section === 'interactionKeys' && <InteractionKeys />}

  </Page>);
}

const LayoutMenuStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;

`;

const LayoutMenuLinkStyled = styled.div`
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: normal;
  font-size: 18px;
  padding: 0 8px 4px 8px;
  transition: 0.05s linear;

  i {
    margin-right: 4px;
  }

  :hover, &[aria-current='true'] {
    color: ${props => props.theme.colors.buttons.primary.activeBorder};
    border-color: ${props => props.theme.colors.buttons.primary.activeBorder};
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    color: ${props => props.theme.colors.font.textInactive};
    filter: saturate(0%);
  }
`;
