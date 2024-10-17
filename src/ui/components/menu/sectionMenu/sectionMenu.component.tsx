import styled from 'styled-components';

const SectionMenu = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.ui.background3};
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;

  > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    :has(.SectionMenuLink) {
      gap: 10px;
    }

    .SectionMenuLink {
      display: block;
      padding: 8px 14px;
      margin: 0;
      background-color: ${props => props.theme.colors.buttons.secondary.bg};
      border: 2px solid ${props => props.theme.colors.buttons.secondary.border};
      color: ${props => props.theme.colors.buttons.secondary.hoverBorder};
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      text-decoration: none;
      transition: 0.1s linear;

      :hover, &[aria-current='true'] {
        background-color: ${props => props.theme.colors.buttons.secondary.hoverBg};
        border-color: ${props => props.theme.colors.buttons.secondary.hoverBorder};
      }

      &[aria-disabled='true'] {
        pointer-events: none;
        color: ${props => props.theme.colors.font.textInactive};
        filter: saturate(0%);
      }

      :is(select) {
        width: auto;
      }
    }

    a {
      font-weight: normal;
      padding: 8px 14px;
      border-radius: 6px;
      color: ${props => props.theme.colors.font.text};
      background-color: ${props => props.theme.colors.buttons.info.bg};
      border: 2px solid ${props => props.theme.colors.buttons.info.bg};

      i {
        font-size: 18px;
      }

      :hover {
        color: ${props => props.theme.colors.font.text};
        background-color: ${props => props.theme.colors.buttons.info.hoverBg};
        border-color: ${props => props.theme.colors.buttons.info.hoverBorder};
      }
    }

    hr {
      border: 1px solid ${props => props.theme.colors.buttons.secondary.bg};
      margin: 0 5px;
      padding: 0;
      height: 36px;
    }
  }
`;

export default SectionMenu;