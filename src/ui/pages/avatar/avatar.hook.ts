import { useEffect, useState } from 'react';
import { AvatarDto, LayoutDto } from 'cmap2-shared';
import useCustomFetch from '../../hooks/customFetch.hook';

export default function useAvatarPage() {

    const customFetch = useCustomFetch();
    const [avatars, setAvatars] = useState<AvatarDto[] | null>();
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

    useEffect(() => {
        customFetch('avatar').then(data => setAvatars(data));
    }, []);

    const selectedAvatar = avatars?.find(avi => avi.id === selectedAvatarId);

    const setSelectedAvatar = (avatar: AvatarDto) => {
        let exists = avatars?.find(avi => avi.id === avatar.id);
        if (!exists) {
            avatars?.push(avatar);
        }
        setSelectedAvatarId(avatar.id);
    };

    console.log('useAvatarPage avatars', avatars);
    console.log('useAvatarPage selectedAvatar', selectedAvatar);

    const onSubmit = (formData: any) => {
        customFetch('avatar', {
            method: 'POST',
            body: JSON.stringify(formData)
        }).then(res => {
            if (res) {
                if (formData.id && res === true) {
                    setSelectedAvatar({...selectedAvatar!, label: formData.label, vrcId: formData.vrcId, default: formData.default});
                } else {
                    setAvatars([...avatars!, res]);
                    setSelectedAvatar(res);
                }
            }
            console.log('/api/avatar/ post response:', res);
        });
    };

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

    return {avatars, setAvatars, selectedAvatar, setSelectedAvatar, onSubmit, addChild, removeChild};
}
