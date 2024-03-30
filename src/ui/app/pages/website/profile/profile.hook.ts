import { useEffect, useState } from 'react';
import { BackgroundDTO, ButtonStyleDTO, ClientDTO, ProfileDTO, UploadedFileDTO } from 'cmap2-shared';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';
import { InteractionKeyDTO } from 'cmap2-shared/dist/types/InteractionKey';

export default function useProlfilePage() {

    const customFetch = useCmapFetch();
    const [client, setClient] = useState<ClientDTO | null>(null);
    const [backgrounds, setBackgrounds] = useState<BackgroundDTO[] | null>(null);
    const [buttonStyles, setButtonStyles] = useState<ButtonStyleDTO[] | null>(null);

    useEffect(() => {
        customFetch<ProfileDTO>('profile', {}, data => {
            setClient(data.client);
            setBackgrounds(data.backgrounds);
            setButtonStyles(data.buttonStyles);
        });
    }, []);

    function setClientPicture(file: UploadedFileDTO) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, image: file};
        });
    }

    function setClientInfo(client: ClientDTO) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, displayName: client.displayName, bio: client.bio, hidden: client.hidden};
        });
    }

    function setInteractionKeys(interactionKeys: InteractionKeyDTO[]) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, interactionkeys: interactionKeys};
        });
    }

    function setClientBackground(background: BackgroundDTO) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, background: background};
        });
    }

    function setClientButtonStyle(buttonStyle: ButtonStyleDTO) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, buttonStyle: buttonStyle};
        });
    }

    return {client, backgrounds, buttonStyles, setClientInfo, setClientPicture, setInteractionKeys, setClientBackground, setClientButtonStyle};
}
