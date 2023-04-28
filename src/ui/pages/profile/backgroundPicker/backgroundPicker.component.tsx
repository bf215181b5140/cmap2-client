import ContentBox from "../../../shared/components/contentBox.component";
import React from "react";
import { BackgroundDto, ClientDto } from "cmap2-shared";
import { ReactProps } from "../../../../shared/global";
import PickerOverlay from "../../../shared/components/PickerOverlay.component";
import styled from "styled-components";
import useCustomFetch from "../../../shared/hooks/customFetch.hook";

interface BackgroundPickerProps extends ReactProps {
    client: ClientDto | null;
    backgrounds: BackgroundDto[] | null;
}

export default function BackgroundPicker({ client, backgrounds }: BackgroundPickerProps) {

    // todo make css classes for backgrounds in shared and import css here
    // todo api call on click

    const customFetch = useCustomFetch();

    function saveSelected(background: BackgroundDto) {
        customFetch('profileBackground', {
            method: 'POST',
            body: JSON.stringify(background),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if(res?.code === 200) {
                // todo what do I pass, setClient or custom function to set it?
                setClient({...client, background: background});
            }
        });
    }

    return(<ContentBox flexBasis='100%' loading={!client}>
        {backgrounds?.map(background => (
        <PickerOverlay selected={client?.background.id === background.id} key={background.id}>
            <Background className={background.className}/>
        </PickerOverlay>
        ))}
    </ContentBox>);
}

const Background = styled.div`
  width: 150px;
  height: 150px;
`;
