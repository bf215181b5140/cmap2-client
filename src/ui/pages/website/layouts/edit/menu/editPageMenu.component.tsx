import PageMenu from '../../../../../components/menu/pageMenu/pageMenu.component';
import { MouseEvent, useContext, useMemo } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { useNavigate, useParams } from 'react-router-dom';
import useEditPageItems from '../hooks/editPageItems.hook';
import { getForcedItemLabel } from 'cmap2-shared';

export default function EditPageMenu() {

  const navigate = useNavigate();
  const { layoutId, groupId, parameterButtonId, presetButtonId, avatarButtonId } = useParams();
  const { layout, group, parameterButton, presetButton, avatarButton } = useEditPageItems();
  const { layouts, avatarButtons } = useContext(LayoutsPageContext);

  const currentItem = useMemo(() => {
    if (avatarButtonId) return 'avatarButton';
    if (presetButtonId) return 'presetButton';
    if (parameterButtonId) return 'parameterButton';
    if (groupId) return 'group';
    if (layoutId) return 'layout';
  }, [layoutId, groupId, parameterButtonId, presetButtonId, avatarButtonId]);

  function onMenuItemClick(event: MouseEvent<HTMLElement>, path: string) {
    event.stopPropagation();
    navigate(path);
  }

  return (<PageMenu>
    <div onClick={() => navigate('/website/layouts/')}>Layouts</div>

    {/* Layout */}
    {layoutId && <>
      <i className={'ri-arrow-right-s-line'} />
      <div aria-current={currentItem === 'layout'}>
        <span className={'PageMenuItemDescription'}>Layout</span>
        {layout?.label || 'New'}
        {layouts.length > 0 && <div className={'PageMenuDropdown'}>
          <ul>
            {layouts.map(l =>
              <li key={l.id} onClick={event => onMenuItemClick(event, `/website/layouts/edit/layout/${l.id}`)}>{l.label}</li>
            )}
          </ul>
        </div>}
      </div>
    </>}

    {/* Group */}
    {groupId && <>
      <i className={'ri-arrow-right-s-line'} />
      <div aria-current={currentItem === 'group'}>
        <span className={'PageMenuItemDescription'}>Group</span>
        {group?.id ? getForcedItemLabel(group, 'group') : 'New'}
        {(layout?.groups?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
          <ul>
            {layout?.groups?.map(g =>
              <li key={g.id} onClick={event => onMenuItemClick(event, `/website/layouts/edit/group/${layout?.id}/${g.id}`)}>{getForcedItemLabel(g, 'group')}</li>
            )}
          </ul>
        </div>}
      </div>
    </>}

    {/* Parameter Button */}
    {parameterButtonId && <>
      <i className={'ri-arrow-right-s-line'} />
      <div aria-current={currentItem === 'parameterButton'}>
        <span className={'PageMenuItemDescription'}>Button</span>
        {parameterButton?.id ? getForcedItemLabel(parameterButton, 'button') : 'New'}
        {(group?.parameterButtons?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
          <ul>
            {group?.parameterButtons?.map(pb =>
              <li key={pb.id} onClick={event => onMenuItemClick(event, `/website/layouts/edit/parameterButton/${layout?.id}/${group?.id}/${pb.id}`)}>{getForcedItemLabel(pb, 'button')}</li>
            )}
          </ul>
        </div>}
      </div>
    </>}

    {/* Preset Button */}
    {presetButtonId && <>
    <i className={'ri-arrow-right-s-line'} />
      <div aria-current={currentItem === 'presetButton'}>
        <span className={'PageMenuItemDescription'}>Preset</span>
        {presetButton?.id ? getForcedItemLabel(presetButton, 'preset') : 'New'}
        {(layout?.presetButtons?.length || 0) > 0 && <div className={'PageMenuDropdown'}>
          <ul>
            {layout?.presetButtons?.map(pb =>
              <li key={pb.id} onClick={event => onMenuItemClick(event, `/website/layouts/edit/presetButton/${layout?.id}/${pb.id}`)}>{getForcedItemLabel(pb, 'preset')}</li>
            )}
          </ul>
        </div>}
      </div>
    </>}

    {/* Avatar Button */}
    {avatarButtonId && <>
    <i className={'ri-arrow-right-s-line'} />
      <div aria-current={currentItem === 'avatarButton'}>
        <span className={'PageMenuItemDescription'}>Avatar</span>
        {avatarButton?.id ? getForcedItemLabel(avatarButton, 'avatar') : 'New'}
        {avatarButtons.length > 0 && <div className={'PageMenuDropdown'}>
          <ul>
            {avatarButtons.map(ab =>
              <li key={ab.id} onClick={event => onMenuItemClick(event, `/website/layouts/edit/avatarButton/${ab.id}`)}>{getForcedItemLabel(ab, 'avatar')}</li>
            )}
          </ul>
        </div>}
      </div>
    </>}

  </PageMenu>);
}