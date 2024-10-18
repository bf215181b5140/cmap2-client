import { ButtonFormDTO } from 'cmap2-shared';
import Section from '../../../../components/section/section.component';
import ButtonForm from './form/buttonForm.component';
import ButtonPreview from './preview/buttonPreview.component';
import { useContext } from 'react';
import { LayoutsPageContext } from '../layouts.context';

export default function ButtonSection() {

  const { button, newButton } = useContext(LayoutsPageContext);
  const formButton: ButtonFormDTO | undefined = undefined;

  return (<Section direction={'row'}>
    <ButtonPreview buttonPreview={formButton} />
    <ButtonForm buttonPreview={formButton} editButton={button || newButton} />
  </Section>);
}