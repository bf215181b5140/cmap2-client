import React from "react";
import ContentBox from "../../../shared/components/contentBox.component";
import { ReactProps } from "../../../../shared/global";
import { BackgroundDto, ButtonDto, ButtonStyleDto, ClientDto } from "cmap2-shared";
import PickerOverlay from "../../../shared/components/PickerOverlay.component";
import ParameterButton from "cmap2-shared/src/components/parameter.button";
import useCustomFetch from "../../../shared/hooks/customFetch.hook";

interface ButtonStylePickerProps extends ReactProps {
    client: ClientDto | null;
    buttonStyles: ButtonStyleDto[] | null;
}

export default function ButtonStylePicker({ client, buttonStyles }: ButtonStylePickerProps) {

    // todo make css classes for backgrounds in shared and add the style to ParameterButton in shared
    // todo api call on click

    const customFetch = useCustomFetch();

    function saveSelected(buttonStyle: ButtonStyleDto) {
        customFetch('profileButtonStyle', {
            method: 'POST',
            body: JSON.stringify(buttonStyle),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if(res?.code === 200) {
                // todo what do I pass, setClient or custom function to set it?
                setClient({...client, buttonStyle: buttonStyle});
            }
        });
    }

    return(<ContentBox flexBasis='100%' loading={!client}>
        {buttonStyles?.map(buttonStyle => (
            <PickerOverlay selected={client?.buttonStyle.id === buttonStyle.id} key={buttonStyle.id}>
                <ParameterButton className={buttonStyle.className} button={new ButtonDto()}/>
            </PickerOverlay>
        ))}
    </ContentBox>);
}
