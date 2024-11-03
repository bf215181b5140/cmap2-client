import Section from '../../../../components/section/section.component';
import GroupForm from './form/groupForm.component';
import { useContext } from 'react';
import { LayoutsPageContext } from '../layouts.context';

export default function GroupSection() {

  return (<Section>
    <GroupForm />
  </Section>);
}