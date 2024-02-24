import { useEffect, useReducer, useState } from 'react';
import { VrcOscAvatar } from '../../../shared/types/osc';
import VrcOscAvatarsReducer from './avatars.reducer';

export default function useAvatarsPage() {

    const [avatars, avatarsDispatch] = useReducer(VrcOscAvatarsReducer, []);
    const [activeAvatar, setActiveAvatar] = useState<VrcOscAvatar | undefined>(undefined);

    useEffect(() => {
        window.electronAPI.get('getVrcOscAvatars').then(data => avatarsDispatch({type: 'setAvatars', avatars: data}));
    }, []);

    useEffect(() => {
        if (avatars.length === 0) {
            setActiveAvatar(undefined);
        } else {
            if (activeAvatar === undefined) {
                resetActiveAvatar();
            } else if (!avatars.find(avatar => avatar.id === activeAvatar.id)) {
                resetActiveAvatar();
            }
        }
    }, [avatars]);

    function resetActiveAvatar() {
        setActiveAvatar(avatars[0]);
    }

    return [avatars, avatarsDispatch, activeAvatar, setActiveAvatar, resetActiveAvatar] as const;
}
