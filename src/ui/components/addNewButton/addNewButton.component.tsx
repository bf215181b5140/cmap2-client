import styled from 'styled-components';

const AddNewButton = styled.div.attrs({ className: 'newItem' })`
  border: 2px dashed ${props => props.theme.colors.ui.element2};
  padding: 24px;
  border-radius: 8px;
  flex: 100%;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: 0.1s linear;
  pointer-events: auto;

  i {
    color: ${props => props.theme.colors.success};
    position: absolute;
    top: 18px;
    right: 30px;
    font-size: 30px;
  }

  :hover {
    border-color: ${props => props.theme.colors.ui.element5};

    > i {
      color: ${props => props.theme.colors.ui.element5};
    }
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    border: none;
    padding: 10px;

    > i {
      display: none;
    }
  }
`;
export default AddNewButton;