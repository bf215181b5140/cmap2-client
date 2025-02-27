import { WindowSize } from '../../../shared/enums/windowSize';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { globalInputStyle } from '../input/input.style';

export default function TitleBarSelect() {

  const [size, setSize] = useState<WindowSize>('Medium');

  useEffect(() => {
    window.IPC.store.get('app').then(settings => setSize(settings.windowSize));
    const removeListener = window.IPC.receive('window:size', size => setSize(size));

    return () => {
      removeListener();
    }
  }, []);

  function setWindowSize(size: WindowSize) {
    window.IPC.send('window:size', size);
  }

  return (<TitleBarSelectStyled>
    <span>Size:</span> {size.substring(0, 1)}
    <div className={'titleBarSelectDropdown'}>
      <ul>
        <li onClick={() => setWindowSize('Small')}>Small</li>
        <li onClick={() => setWindowSize('Medium')}>Medium</li>
        <li onClick={() => setWindowSize('Large')}>Large</li>
      </ul>
    </div>
  </TitleBarSelectStyled>);

}

const TitleBarSelectStyled = styled.div`
  ${globalInputStyle};
  height: 36px;
  padding: 0 10px;
  position: relative;
  cursor: pointer;

  > span {
    color: grey;
    padding-right: 5px;
  }

  > div.titleBarSelectDropdown {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -5px;
    right: -5px;
    z-index: 4;

    :hover {
      padding-top: 38px;

      > ul {
        display: block;
      }
    }

    > ul {
      display: none;
      margin: 0;
      list-style: none;
      padding: 4px;
      cursor: initial;
      background: ${props => props.theme.colors.ui.appBgOpaque}dd;
      border: 2px solid ${props => props.theme.colors.input.border};
      box-shadow: 0 0 8px black;
      border-radius: 6px;
      backdrop-filter: blur(1px);

      > li {
        display: block;
        padding: 4px;
        margin: 0;
        color: ${props => props.theme.colors.font.text};
        cursor: pointer;

        :hover {
          color: ${props => props.theme.colors.font.textBright};
        }
      }
    }

  }
`;