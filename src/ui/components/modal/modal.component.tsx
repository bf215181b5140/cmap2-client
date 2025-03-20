import React, { useContext } from 'react';
import styled from 'styled-components';
import { ModalContext } from '../context/modal.context';

export default function ModalComponent() {

  const { modal } = useContext(ModalContext);

  if (!modal) {
    return null;
  }

  return (<ModalWrapper>
    <ModalStyled>

      {modal}

    </ModalStyled>
  </ModalWrapper>);
}

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
  backdrop-filter: blur(2px);
`;

const ModalStyled = styled.div`
  background-color: ${props => props.theme.colors.ui.background3};
    // border: 2px solid ${props => props.theme.colors.ui.appBg};
  border-radius: 8px;
  min-width: 350px;
  max-width: 600px;
  min-height: 125px;
  max-height: 400px;
  padding: 15px;
  box-shadow: 0 0 16px #00000055;

  #modalHeader {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
    gap: 10px;

    h2 {
      margin: 0 !important;
      padding: 0 !important;
    }

    span {
      padding: 0 5px;
      font-size: 20px;
      display: block;
      cursor: pointer;
    }
  }

  #modalFooter {
    margin-top: 10px;
    text-align: end;
  }
`;
