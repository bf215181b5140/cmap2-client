import styled, { css } from 'styled-components';

const Form = styled.form<{ visible?: boolean }>`
  ${props => props.visible && css`
    background: ${props => props.theme.colors.ui.background5};
    padding: 5px 8px;
    border-radius: 8px;
  `}

  fieldset {
    margin: 5px 0;
    border-color: ${props => props.theme.colors.ui.element2};
    transition: 0.1s linear;

    :hover {
      border-color: ${props => props.theme.colors.ui.element1};
    }
  }
`;

export default Form;