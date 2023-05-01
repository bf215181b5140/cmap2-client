import { useEffect, useState } from 'react';
import { BackgroundDto, ButtonStyleDto, ClientDto, Profile, TierDto } from 'cmap2-shared';
import useCustomFetch from '../../shared/hooks/customFetch.hook';

export default function useProlfilePage() {

    const customFetch = useCustomFetch();
    const [client, setClient] = useState<ClientDto | null>(null);
    const [backgrounds, setBackgrounds] = useState<BackgroundDto[] | null>(null);
    const [buttonStyles, setButtonStyles] = useState<ButtonStyleDto[] | null>(null);

    useEffect(() => {
        customFetch<Profile>('profile').then(res => {
            if (res?.body) {
                setClient(res.body.client);
                setBackgrounds(res.body.backgrounds);
                setButtonStyles(res.body.buttonStyles);
            }
        });
    }, []);

    const onSubmit = (formData: any) => {
        customFetch('profile', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res?.code === 200) {
                setClient({...client, ...formData});
            }
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
