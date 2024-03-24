import { useEffect, useState } from 'react';
import { BackgroundDTO, ButtonStyleDTO, ClientDTO, ProfileDTO, UploadedFileDTO } from 'cmap2-shared';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';

export default function useProlfilePage() {

    const customFetch = useCmapFetch();
    const [client, setClient] = useState<ClientDTO | null>(null);
    const [backgrounds, setBackgrounds] = useState<BackgroundDTO[] | null>(null);
    const [buttonStyles, setButtonStyles] = useState<ButtonStyleDTO[] | null>(null);

    useEffect(() => {
        customFetch<ProfileDTO>('profile', {}, data => {
            if (data.client) setClient(data.client);
            if (data.backgrounds) setBackgrounds(data.backgrounds);
            if (data.buttonStyles) setButtonStyles(data.buttonStyles);
        });
    }, []);

    function setClientPicture(file: UploadedFileDTO) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, image: file};
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

    return {client, backgrounds, buttonStyles, setClient, setClientPicture, setClientBackground, setClientButtonStyle};
}
