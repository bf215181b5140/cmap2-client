import { useEffect, useState } from 'react';
import { ClientDto, Profile, TierDto } from 'cmap2-shared';
import useCustomFetch from '../../hooks/customFetch.hook';

export default function useProlfilePage() {

    const customFetch = useCustomFetch();
    const [client, setClient] = useState<ClientDto | null>();
    const [clientTier, setClientTier] = useState<TierDto | null>();

    useEffect(() => {
        customFetch<Profile>('profile').then(res => {
            if (res?.body) {
                setClient(res.body.client);
                setClientTier(res.body.tier);
            }
        });
    }, []);

    const onSubmit = (formData: any) => {
        customFetch('profile', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if(res?.code === 200) {
                setClient({...client, ...formData});
            }
        });
    }

    function setClientPicture(picture: string) {
        if (client) {
            setClient({...client, picture: picture});
        }
    }

    return {client, clientTier, onSubmit, setClientPicture};
}
