import { useCallback, useEffect, useState } from 'react';
import { AvatarDto, LayoutDto } from 'cmap2-shared/dist/dtos';
import { ClientCredentials } from 'cmap2-shared';

export default function useAvatarPage(clientCredentials: ClientCredentials) {
    const [avatars, setAvatars] = useState<AvatarDto[]>();
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(clientCredentials.serverUrl + '/api/avatar/' + clientCredentials.username, {method: 'GET'});
            const resData = await res.json() as AvatarDto[];
            console.log('Recieved /api/avatar/readAvatars: ', resData);
            setAvatars(resData);
            const defaultAvatar = resData.find((avatar) => avatar.default);
            if (defaultAvatar) {
                setSelectedAvatar(defaultAvatar);
            } else {
                setSelectedAvatar(new AvatarDto());
            }
        };
        fetchData();
    }, []);

    const selectedAvatar = avatars?.find(avi => avi.id === selectedAvatarId);

    const setSelectedAvatar = (avatar: AvatarDto) => {
        let exists = avatars?.find(avi => avi.id === avatar.id);
        if (exists) {
            exists = avatar;
        } else {
            avatars?.push(avatar);
        }
        setSelectedAvatarId(avatar.id);
    };

    console.log('useAvatarPage avatars', avatars)
    console.log('useAvatarPage selectedAvatar', selectedAvatar)

    const addChild = (layout: LayoutDto) => {
        if (selectedAvatar?.layouts) {
            selectedAvatar.layouts.push(layout);
            // setAvatars([...avatars!]);
        }
    };

    const removeChild = (childId: string) => {
        if (selectedAvatar?.layouts) {
            selectedAvatar.layouts = selectedAvatar.layouts.filter((layout) => layout.id !== childId);
            // setAvatars([...avatars!]);
        }
    };

    return {avatars, setAvatars, selectedAvatar, setSelectedAvatar, addChild, removeChild};
}
