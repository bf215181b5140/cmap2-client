import styled from 'styled-components';

export default function LoadingSpinner() {
    return(<LoadingSpinnerStyled>
        <div className={'spinner'} />
    </LoadingSpinnerStyled>)
}

export const LoadingSpinnerStyled = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;

    div {
        width: 48px;
        height: 48px;
        margin: 24px;
        border: 5px solid #FFF;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
`;
