import useCmapFetch from '../../../hooks/cmapFetch.hook';
import useModalHook from '../../../components/modal/modal.hook';
import { useContext, useState } from 'react';
import { LayoutsPageContext } from '../layouts.context';
import { LayoutSchema } from 'cmap2-shared';
import Section from '../../../components/section/section.component';
import SectionMenu from '../../../components/menu/sectionMenu/sectionMenu.component';
import IconButton from '../../../components/buttons/iconButton.component';
import LayoutPreview from './preview/layoutPreview.component';
import LayoutForm from './form/layoutForm.component';
import ParameterBadges from './parameterBadges/parameterBadges.component';

type LayoutSegments = 'preview' | 'settings' | 'parameterBadges';

export default function LayoutSection() {

  const { PUT, DELETE } = useCmapFetch();
  const { setModal } = useModalHook();
  const { layoutsDispatch, layout } = useContext(LayoutsPageContext);
  const [segment, setSegment] = useState<LayoutSegments>('preview');

  if (!layout && segment !== 'settings') setSegment('settings');

  function onCopy() {
    if (!layout) return;
    setModal({
      title: `Copying layout ${layout?.label}`,
      message: 'You are about to make a copy of this layout.',
      confirmFunction: () => {
        PUT('layouts/layout/copy', { id: layout.id }, LayoutSchema, data => {
          layoutsDispatch({ type: 'addLayout', layout: data })
        })
      },
    });
  }

  function onDelete() {
    if (!layout) return;

    DELETE('layouts/layout', { id: layout.id }, undefined, () => {
      layoutsDispatch({ type: 'removeLayout', layout })
    })
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
        <IconButton role={'delete'} size={'small'} margin={'0 5px'} deleteKeyword={'layout'} disabled={!layout} onClick={onDelete} />
      </div>
    </SectionMenu>

    {segment === 'preview' && <LayoutPreview />}
    {segment === 'settings' && <LayoutForm layout={layout} />}
    {segment === 'parameterBadges' && <ParameterBadges />}

  </Section>);
}
