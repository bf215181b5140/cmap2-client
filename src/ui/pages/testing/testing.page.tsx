import { Page, PAGE_ELEMENT_GAP } from '../../components/page/page.component';
import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications.hook';
import styled from 'styled-components';
import { GroupWidth } from 'cmap2-shared';
import './testing.style.css';
import Layout from '../../components/preview/layout/layout.component';
import LayoutGroup from '../../components/preview/group/layoutGroup.component';
import LayoutButton from '../../components/preview/button/layoutButton.component';
import Segment from '../../components/segment/segment.component';
import { Link } from 'react-router-dom';
import IconButton from '../../components/buttons/iconButton.component';
import SectionMenu from '../../components/menu/sectionMenu/sectionMenu.component';
import { PageMenuSelect } from '../../components/menu/pageMenu/pageMenuSelect.component';
import { SelectInputStyled } from '../../components/input/input.style';

export default function TestingPage() {

  const { addNotification } = useNotifications();
  const [groups, setGroups] = useState<GroupWidth[]>(['None', 'None', 'None', 'None', 'Third', 'None', 'Half', 'Half', 'Third', 'Third', 'Third', 'Third', 'Half', 'Full']);
  const [buttons, setButtons] = useState<string[]>(['150px', '200px', '300px', '150px', '200px', '300px', '150px', '200px', '300px', '150px', '200px', '300px']);

  return (<Page flexDirection={'column'}>

    <Segment segmentTitle={'Testing segment 1'}>
    </Segment>

    <SectionMenu>
      <div>
        <SelectInputStyled className={'SectionMenuLink'}>
          {['one', 'two', 'three', 'four', 'five but this one is a lot longer']?.map(l => <option key={l} value={l}>{l}</option>)}
        </SelectInputStyled>

        <div className={'SectionMenuLink'}>Normal</div>
        <div className={'SectionMenuLink'}>Another one</div>
        <div className={'SectionMenuLink'} aria-current={true}>Selected</div>
        <div className={'SectionMenuLink'} aria-disabled={true}>Disabled</div>
      </div>
      {/* <div> */}
      {/*   Hello this is section menu */}
      {/* </div> */}
      {/* <div> */}
      {/*   <IconButton role={'normal'} size={'small'} /> */}
      {/*   <hr /> */}
      {/*   <IconButton role={'delete'} size={'small'} /> */}
      {/* </div> */}
    </SectionMenu>

    <Segment segmentTitle={'Testing segment 2'}>
    </Segment>
    <Segment segmentTitle={'Testing segment 3'}>
    </Segment>

  {/*   <Layout> */}
  {/*   {groups.map((group, gi) => <LayoutGroup key={gi} width={group}> */}
  {/*     <h2 className={'layoutGroupLabel'}>Group {group + ' ' + gi}</h2> */}
  {/*     <div className={'layoutButtonWrapper'}> */}
  {/*       {Array.from({ length: Math.floor(Math.random() * 10) + 4 }, () => '').map((button, bi) => */}
  {/*         <LayoutButton key={gi + '' + bi} height={Math.floor((Math.random() * 250) + 50) + 'px'}> */}
  {/*           <ParameterButton></ParameterButton> */}
  {/*         </LayoutButton> */}
  {/*       )} */}
  {/*     </div> */}
  {/*   </LayoutGroup>)} */}
  {/* </Layout> */}
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