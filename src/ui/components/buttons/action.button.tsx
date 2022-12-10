import styled from "styled-components";

export default function ActionButton(props: any) {

    return (<ActionButtonStyled>
        <button onClick={props.action}>{props.icon && <i className={props.icon}></i>} {props.children}</button>
    </ActionButtonStyled>);
}

const ActionButtonStyled = styled.div`
  display: inline-block;

  button {
    margin: 7px;
    padding: 10px;
    color: #b8b9b9;
    background: #163136;
    border: 2px solid #1f4046;
    border-radius: 7px;
    font-size: 20px;
    transition: 0.15s linear;

    :hover {
      transform: scale(1.1) perspective(1px);
      background: #204951;
      border: 2px solid #3f9cb3;
    }

    i {
      color: #2baac1;
      float: left;
      font-size: 1.75em;
      margin: -0.2em 0 -0.2em -0.2em;
    }
  }
`;