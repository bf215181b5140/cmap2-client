import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import { useContext, useState } from 'react';
import { LayoutsPageContext } from '../layouts.context';
import { LayoutSchema } from 'cmap2-shared';
import Section from '../../../../components/section/section.component';
import SectionMenu from '../../../../components/menu/sectionMenu/sectionMenu.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import LayoutPreview from './preview/layoutPreview.component';
import LayoutForm from './form/layoutForm.component';
import ParameterBadges from './parameterBadges/parameterBadges.component';
import { ModalContext } from '../../../../components/context/modal.context';
import BasicModal from '../../../../components/modal/basicModal/basicModal.component';

type LayoutSegments = 'preview' | 'settings' | 'parameterBadges';

export default function LayoutSection() {

  const { POST, DELETE } = useCmapFetch();
  const { setModal } = useContext(ModalContext);
  const { layoutsDispatch, layout } = useContext(LayoutsPageContext);
  const [segment, setSegment] = useState<LayoutSegments>('preview');

  if (!layout && segment !== 'settings') setSegment('settings');

  function onCopy() {
    if (!layout) return;
    setModal(<BasicModal title={`Copying layout ${layout?.label}`} message={'You are about to make a copy of this layout.'} confirmFunction={() => {
      POST('layouts/layout/copy', { id: layout.id }, LayoutSchema, data => {
        layoutsDispatch({ type: 'addLayout', layout: data });
      });
    }} />);
  }

  function onDelete() {
    if (!layout) return;

    DELETE('layouts/layout', { id: layout.id }, undefined, () => {
      layoutsDispatch({ type: 'removeLayout', layout });
    });
  }

  return (<Section>
    <SectionMenu>
      <div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('preview')} aria-current={segment === 'preview'} aria-disabled={!layout}>Preview</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('settings')} aria-current={segment === 'settings'}>Settings</div>
        <div className={'SectionMenuLink'} onClick={() => setSegment('parameterBadges')} aria-current={segment === 'parameterBadges'} aria-disabled={!layout}>Parameter badges</div>
      </div>
      <div>
        <IconButton role={'normal'} size={'small'} margin={'0 5px'} tooltip={'Create a copy'} icon={'ri-file-copy-line'} disabled={!layout} onClick={onCopy} />
        <IconButton role={'delete'} size={'small'} margin={'0 5px'} tooltip={'Delete layout'} deleteKeyword={'layout'} disabled={!layout} onClick={onDelete} />
      </div>
    </SectionMenu>

    {segment === 'preview' && <LayoutPreview />}
    {segment === 'settings' && <LayoutForm layout={layout} />}
    {segment === 'parameterBadges' && <ParameterBadges />}

  </Section>);
}
