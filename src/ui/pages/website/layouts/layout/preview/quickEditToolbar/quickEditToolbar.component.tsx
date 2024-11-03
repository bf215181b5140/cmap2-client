import styled from 'styled-components';
import { LayoutsPageDTO } from 'cmap2-shared';
import { QuickEditItem } from './quickEditToolbar.model';
import TextButton from '../../../../../../components/buttons/textButton.component';
import IconButton from '../../../../../../components/buttons/iconButton.component';

interface QuickEditToolbarProps {
  item: QuickEditItem;
}

export default function QuickEditToolbar({ item }: QuickEditToolbarProps) {

  return (<QuickEditToolbarStyled>
    <div>
      <TextButton text={'Hello :D'} />
    </div>
    <div>
      Editing {item.groupId}
    </div>
    <div>
      <span className={'grey'}>Double click to edit right away</span>
      <hr />
      <IconButton role={'edit'} size={'small'} tooltip={'Go to edit!'} />
    </div>
  </QuickEditToolbarStyled>);
}

const QuickEditToolbarStyled = styled.div`
  background-color: ${props => props.theme.colors.ui.background3};
  border-bottom: 2px solid ${props => props.theme.colors.ui.appBgOpaque};
  border-radius: 0 0 8px 8px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 2;
  //box-shadow: 0 0 5px black;
  
  > div {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  
    hr {
      border: 1px solid ${props => props.theme.colors.ui.background5};
      margin: 0;
      height: 30px;
    }
  }
`;