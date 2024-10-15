import { Page, PAGE_ELEMENT_GAP } from '../../components/page/page.component';
import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications.hook';
import styled from 'styled-components';
import { GroupWidth } from 'cmap2-shared';
import './testing.style.css';
import Layout from '../../components/preview/layout/layout.component';
import LayoutGroup from '../../components/preview/group/layoutGroup.component';
import LayoutButton from '../../components/preview/button/layoutButton.component';

export default function TestingPage() {

  const { addNotification } = useNotifications();
  const [groups, setGroups] = useState<GroupWidth[]>(['None', 'None', 'None', 'None', 'Third', 'None', 'Half', 'Half', 'Third', 'Third', 'Third', 'Third', 'Half', 'Full']);
  const [buttons, setButtons] = useState<string[]>(['150px', '200px', '300px', '150px', '200px', '300px', '150px', '200px', '300px', '150px', '200px', '300px']);

  return (<Page>
    <Layout>
    {groups.map((group, gi) => <LayoutGroup key={gi} width={group}>
      <h2 className={'layoutGroupLabel'}>Group {group + ' ' + gi}</h2>
      <div className={'layoutButtonWrapper'}>
        {Array.from({ length: Math.floor(Math.random() * 10) + 4 }, () => '').map((button, bi) =>
          <LayoutButton key={gi + '' + bi} height={Math.floor((Math.random() * 250) + 50) + 'px'}>
            <ParameterButton></ParameterButton>
          </LayoutButton>
        )}
      </div>
    </LayoutGroup>)}
  </Layout>
  </Page>);
}




const ParameterButton = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('https://changemyavatarparams.com/files/sawks/4526cd-kxJHDe.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid red;
`;