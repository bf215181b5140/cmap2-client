import styled from 'styled-components';

const SectionMenu = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    padding: 0 20px;

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
            color: ${props => props.theme.colors.ui.element5};
            background-color: ${props => props.theme.colors.ui.background3};
            border: 2px solid ${props => props.theme.colors.ui.element2};
            border-radius: 6px;
            cursor: pointer;
            font-size: 18px;
            text-decoration: none;
            transition: 0.1s linear;

            :hover, &[aria-current='true'] {
                color: ${props => props.theme.colors.font.text};
                border-color: ${props => props.theme.colors.ui.element4};

                :not(select) {
                    transform: scale(1.05);
                }
            }

            &[aria-disabled='true'] {
                pointer-events: none;
                color: ${props => props.theme.colors.font.textInactive};
                filter: saturate(0%);
            }
        }
    }

    hr {
        border: 1px solid ${props => props.theme.colors.ui.background3};
        margin: 0 5px;
        padding: 0;
        height: 40px;
    }
`;

export default SectionMenu;