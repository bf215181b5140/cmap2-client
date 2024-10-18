import Section from '../../../../components/section/section.component';
import GroupForm from './form/groupForm.component';
import { useContext } from 'react';
import { LayoutsPageContext } from '../layouts.context';

export default function GroupSection() {

  const { group, newGroup } = useContext(LayoutsPageContext);

  return (<Section>
    <GroupForm editGroup={group || newGroup} />
  </Section>);
}