import Section from '../../../../components/section/section.component';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { LayoutsPageContext } from '../layouts.context';
import { useNavigate } from 'react-router-dom';

export default function LayoutsSection() {

  const { client, newLayout } = useContext(LayoutsPageContext);
  const navigate = useNavigate();

  const canAddLayout = client.layouts.length < client.tier.layouts;

  return (<Section>
    <LayoutPicker>
      {client.layouts?.map(l => <div key={l.id} onClick={() => navigate(`/website/layouts/${l.id}`)}>
        <h2>{l.label}</h2>
        <div>{l.avatars.length} avatars</div>
        <div>{l.groups?.length || 0} groups</div>
        <div>{l.groups?.reduce((sum, g) => sum += (g.buttons?.length || 0), 0) || 0} buttons</div>
      </div>)}

      <div onClick={() => navigate('/website/layouts/new')} className={'addNew'} aria-disabled={!canAddLayout}>
        <i className={'ri-function-add-fill'} />
        <div>{client.layouts.length}/{client.tier.layouts}</div>
        <h2>{canAddLayout ? 'Add layout' : 'Limit reached'}</h2>
      </div>
    </LayoutPicker>
  </Section>)
}


const LayoutPicker = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 0 20px;

  > div {
    width: 250px;
    min-height: 160px;
    background-color: ${props => props.theme.colors.ui.background3};
    border: 2px solid ${props => props.theme.colors.buttons.primary.border};
    transition: 0.1s linear;
    padding: 20px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;

    h2 {
      margin-top: 0;
      color: ${props => props.theme.colors.font.h3};
    }

    > div {
      margin: 5px;
    }

    :hover {
      border-color: ${props => props.theme.colors.buttons.primary.hoverBorder};
      transform: scale(1.05);
    }

    &.addNew {
      background: none;
      border-style: dashed;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      i {
        color: ${props => props.theme.colors.buttons.secondary.hoverBg};
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 50px;
      }
    }

    &[aria-disabled='true'] {
      border-color: ${props => props.theme.colors.error};
      color: ${props => props.theme.colors.error};
      pointer-events: none;
    }
  }
`;