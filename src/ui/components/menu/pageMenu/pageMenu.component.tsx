import styled, { css } from 'styled-components';
import { PAGE_ELEMENT_GAP } from '../../page/page.component';

const PageMenu = styled.div<{ noMarginTop?: boolean }>`
  width: 100%;
  margin-top: -${PAGE_ELEMENT_GAP};
  border-radius: 0 0 8px 8px;
  padding: 0 25px;
  background-color: ${props => props.theme.colors.segment.bg};
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  text-align: center;

  > i {
    color: ${props => props.theme.colors.font.textInactive};
    font-size: 20px;
  }

  > div {
    cursor: pointer;
    flex: 1;
    padding: 12px;
    color: ${props => props.theme.colors.font.text};
    border-bottom: 2px solid ${props => props.theme.colors.ui.background3};
    position: relative;

    :hover, &[aria-current='true'] {
      color: ${props => props.theme.colors.font.textActive};
      border-bottom: 2px solid ${props => props.theme.colors.font.textActive};
    }

    &[aria-disabled='true'] {
      color: ${props => props.theme.colors.font.textInactive};
      pointer-events: none;
      filter: saturate(0%);
    }

    > div.PageMenuDropdown {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      :hover {
        height: fit-content;
        padding-top: 50px;

        > ul {
          display: block;
        }
      }

      > ul {
        display: none;
        margin: 0;
        list-style: none;
        padding: 3px;
        max-height: 300px;
        overflow: auto;
        z-index: 2;
        cursor: initial;
        background: ${props => props.theme.colors.ui.appBgOpaque}dd;
        border: 2px solid ${props => props.theme.colors.ui.element2};
        box-shadow: 0 0 10px black;
        border-radius: 6px 6px 8px 8px;
        backdrop-filter: blur(1px);

        > li {
          display: block;
          padding: 4px 7px;
          margin: 0;
          text-align: left;
          border: 2px solid transparent;
          color: ${props => props.theme.colors.font.text};
          cursor: pointer;

          :hover {
            background: ${props => props.theme.colors.ui.element3};
            border-color: ${props => props.theme.colors.ui.element4};
            border-radius: 6px;

          }
        }
      }
    }
  }
`;

export default PageMenu;