import { useEffect, useState } from 'react';
import useCmapFetch from '../../../hooks/cmapFetch.hook';
import { ClientDTO, ClientSchema, InteractionKeyDTO, ProfileFormDTO, UploadedFileDTO } from 'cmap2-shared';

export default function useProlfilePage() {

    const { GET } = useCmapFetch();
    const [client, setClient] = useState<ClientDTO | undefined>();

    useEffect(() => {
        GET('profile', ClientSchema, data => {
            setClient(data);
        });
    }, []);

    function setProfileInfo(profileForm: ProfileFormDTO) {
        setClient(prevState => {
            if (!prevState) return undefined;
            return { ...prevState, ...profileForm };
        });
    }

    function setClientPicture(file: UploadedFileDTO) {
        setClient(prevState => {
            if (!prevState) return undefined;
            return { ...prevState, image: file };
        });
    }

    function setInteractionKeys(interactionKeys: InteractionKeyDTO[]) {
        setClient(prevState => {
            if (!prevState) return undefined;
            return { ...prevState, interactionkeys: interactionKeys };
        });
    }

    return { client, setProfileInfo, setClientPicture, setInteractionKeys };
}
