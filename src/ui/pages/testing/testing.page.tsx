import { Page } from '../../components/page/page.component';
import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications.hook';
import styled from 'styled-components';
import { GroupWidth, LayoutFormDTO, LayoutFormSchema } from 'cmap2-shared';
import './testing.style.css';
import Segment from '../../components/segment/segment.component';
import PageMenu from '../../components/menu/pageMenu/pageMenu.component';
import AvatarInput from '../../components/input/avatarInput/avatarInput.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function TestingPage() {

  const { register, setValue, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  const { addNotification } = useNotifications();
  const [groups, setGroups] = useState<GroupWidth[]>(['None', 'None', 'None', 'None', 'Third', 'None', 'Half', 'Half', 'Third', 'Third', 'Third', 'Third',
                                                      'Half', 'Full']);
  const [buttons, setButtons] = useState<string[]>(['150px', '200px', '300px', '150px', '200px', '300px', '150px', '200px', '300px', '150px', '200px',
                                                    '300px']);

  return (<Page flexDirection={'column'}>

    <PageMenu>
      <div aria-current={false} aria-disabled={false}>Layouts</div>
      <i className={'ri-arrow-right-s-line'} />
      <div aria-current={false} aria-disabled={false}>
        Layout
        <div className={'PageMenuDropdown'}>
          <ul>
            <li>Layout 1 :D</li>
            <li>Layout 2 border</li>
            <li>Layout 3 background</li>
            <li>Layout 4 but this one has a lot longer title</li>
            <li>Layout 5 right</li>
            <li>Layout 6 Pellentesque</li>
            <li>Layout 7 tincidunt</li>
            <li>Layout 8 lacus</li>
            <li>Layout 9 blandit</li>
            <li>Layout 9 et tincidunt</li>
            <li>Layout 9 Vestibulum</li>
            <li>Layout 9 euismod</li>
            <li>Layout 9 aliquet</li>
          </ul>
        </div>
      </div>
      <i className={'ri-arrow-right-s-line'} />
      <div aria-current={true} aria-disabled={false}>
        Group
        <div className={'PageMenuDropdown'}>
          <ul>
            <li>:D</li>
            <li>border</li>
            <li>Group 3 background</li>
            <li>Group 4 but this one has a lot longer title</li>
            <li>Group 5 right</li>
            <li>Group 6 Pellentesque</li>
            <li>Group 7 tincidunt</li>
            <li>Group 8 lacus</li>
            <li>Group 9 blandit</li>
            <li>Group 9 et tincidunt</li>
            <li>Group 9 Vestibulum</li>
            <li>Group 9 euismod</li>
            <li>Group 9 aliquet</li>
          </ul>
        </div>
      </div>
      <i className={'ri-arrow-right-s-line'} />
      <div aria-current={false} aria-disabled={true}>Button</div>
    </PageMenu>


    <Segment segmentTitle={'Testing segment 2'}>
      <AvatarInput register={register} name={'avatar1'} setValue={setValue} errors={errors} />
      <AvatarInput register={register} name={'avatar2'} width={'250px'} setValue={setValue} errors={errors} />

      <p>Pellentesque at blandit justo. Vestibulum et tincidunt massa. Nunc quis aliquam lacus. Etiam eget aliquet ex, id euismod felis. Nullam sed elit at
        purus pulvinar mattis vel eu sem. Mauris in
        fermentum metus, a venenatis leo. Morbi eget nulla nulla. Vestibulum volutpat lorem nec commodo volutpat. Aenean vel quam sed leo lacinia suscipit.
        Aliquam dignissim sodales felis sit amet
        laoreet. Quisque non nisi condimentum, egestas libero ac, tristique tortor. Cras ut neque tincidunt, iaculis risus a, lobortis orci. Aliquam dolor nisi, rutrum eu nulla vel, auctor lacinia
        mauris.</p>
      <TestDivBg></TestDivBg>
      <TestDivBorder></TestDivBorder>
      <TestDivBgBorder></TestDivBgBorder>
    </Segment>

    <TestDivBg></TestDivBg>
    <TestDivBorder></TestDivBorder>
    <TestDivBgBorder></TestDivBgBorder>

    <Segment segmentTitle={'Testing segment 3'}>
      <TestDivBg></TestDivBg>
      <TestDivBorder></TestDivBorder>
      <TestDivBgBorder></TestDivBgBorder>
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

const TestDiv = styled.div`
  display: inline-block;
  width: 250px;
  height: 250px;
  margin: 10px;
`;

const TestDivBorder = styled(TestDiv)`
  border: 2px solid ${props => props.theme.colors.ui.element2};
`;

const TestDivBg = styled(TestDiv)`
  background: ${props => props.theme.colors.ui.element2};
`;

const TestDivBgBorder = styled(TestDiv)`
  background: ${props => props.theme.colors.ui.element2};
  border: 2px solid ${props => props.theme.colors.ui.element1};
`;