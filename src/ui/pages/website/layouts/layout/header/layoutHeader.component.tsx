import styled from 'styled-components';
import { LayoutDTO, ParameterBadgeTypeSchema } from 'cmap-shared';
import { useNavigate, useParams } from 'react-router-dom';
import AddCounter from '../../../../../components/addCounter/addCounter.component';
import AddNewButton from '../../../../../components/addNewButton/addNewButton.component';
import { SelectInputStyled } from '../../../../../components/input/input.style';
import { useContext } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { HealthAndExp, ParameterBadge } from 'cmap-shared/react';

interface LayoutProps {
  layout?: LayoutDTO;
}

export default function LayoutHeader({ layout }: LayoutProps) {

  const navigate = useNavigate();
  const { layoutId } = useParams();
  const { tier, layouts } = useContext(LayoutsPageContext);

  const canAddLayout = layouts.length <= tier.layouts;

  const health = Math.floor(Math.random() * 20);
  const exp = Math.floor(Math.random() * 100);

  function parameterBadgeMap() {
    const map = new Map<string, string | number | boolean>();
    layout?.parameterBadges?.forEach(badge => {
      switch (badge.type) {
        case ParameterBadgeTypeSchema.Values.Afk:
          map.set(badge.path, true);
          break;
        case ParameterBadgeTypeSchema.Values.VrMode:
          map.set(badge.path, 1);
          break;
        case ParameterBadgeTypeSchema.Values.Mute:
          map.set(badge.path, true);
          break;
        case ParameterBadgeTypeSchema.Values.TrackingType:
          map.set(badge.path, 6);
          break;
        case ParameterBadgeTypeSchema.Values.Custom:
          if (badge.label.includes('{v}')) {
            map.set(badge.path, Math.floor(Math.random() * 20));
            break;
          }
          if (badge.value !== null) {
            map.set(badge.path, badge.value);
            break;
          }
          break;
      }

    });
    return map;
  }

  return (<LayoutHeaderStyled>
    <SelectedLayoutStyled onClick={() => navigate(`/website/layouts/edit/layout/${layout?.id}`)} aria-disabled={!layout?.id}>

      <SelectInputStyled value={layoutId} onClick={event => event.stopPropagation()} onChange={(event) => navigate(`/website/layouts/${event.target.value}`)}>
        {layouts.map(layout => (<option key={layout.id} value={layout.id}>{layout.label}</option>))}
      </SelectInputStyled>

      {(layout?.parameterBadges?.length || 0) > 0 && <div>{layout?.parameterBadges?.map(badge => <ParameterBadge key={badge.id} badge={badge} parameters={parameterBadgeMap()} />)}</div>}
      {layout && <HealthAndExp layout={layout} health={health} exp={exp} />}

    </SelectedLayoutStyled>

    <AddNewLayout onClick={() => navigate(`/website/layouts/edit/layout/new`)} aria-disabled={!canAddLayout}>
      <span>
        <AddCounter canAddMore={canAddLayout}>{layouts.length}/{tier.layouts}</AddCounter>
        {canAddLayout ? 'Add layout' : 'Limit reached'}
      </span>
    </AddNewLayout>

  </LayoutHeaderStyled>);
}

const LayoutHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
`;

const SelectedLayoutStyled = styled.div`
  background: ${props => props.theme.colors.ui.contentBg};
  padding: 16px;
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: 0.1s linear;

  :hover:not(:has(select:hover)) {
    box-shadow: inset 0 0 0px 2px ${props => props.theme.colors.ui.highlight4};
  }

  > h2 {
    margin: 0;
    padding: 0;
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    
    > select {
      pointer-events: auto;
    }
  }
`;

const AddNewLayout = styled(AddNewButton)`
  padding: 16px;
  flex: none;
  width: 180px;
  //height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;