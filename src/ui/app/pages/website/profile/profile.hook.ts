import { useEffect, useState } from 'react';
import { BackgroundDto, ButtonStyleDto, ClientDto, Profile, TierDto } from 'cmap2-shared';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';

export default function useProlfilePage() {

    const customFetch = useCmapFetch();
    const [client, setClient] = useState<ClientDto | null>(null);
    const [backgrounds, setBackgrounds] = useState<BackgroundDto[] | null>(null);
    const [buttonStyles, setButtonStyles] = useState<ButtonStyleDto[] | null>(null);

    useEffect(() => {
        customFetch<Profile>('profile', {}, data => {
            setClient(data.client);
            setBackgrounds(data.backgrounds);
            setButtonStyles(data.buttonStyles);
        });
    }, []);

    const onSubmit = (formData: any) => {
        customFetch('profile', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }, () => {
            setClient({...client, ...formData});
        });
    };

    function setClientPicture(picture: string) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, picture: picture};
        });
    }

    function setClientBackground(background: BackgroundDto) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, background: background};
        });
    }

    function setClientButtonStyle(buttonStyle: ButtonStyleDto) {
        setClient(prevState => {
            if (!prevState) return null;
            return {...prevState, buttonStyle: buttonStyle};
        });
    }

    return {client, backgrounds, buttonStyles, onSubmit, setClientPicture, setClientBackground, setClientButtonStyle};
}
