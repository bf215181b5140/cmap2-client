import Section from '../../../../components/section/section.component';
import GroupForm from './form/groupForm.component';
import { useContext } from 'react';
import { LayoutsPageContext } from '../layouts.context';

export default function GroupSection() {

  const { group } = useContext(LayoutsPageContext);

  return (<Section>
    <GroupForm group={group} />
  </Section>);
}