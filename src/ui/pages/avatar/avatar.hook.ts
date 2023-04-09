import { useEffect, useReducer, useState } from 'react';
import { AvatarDto, ButtonDto, LayoutDto } from 'cmap2-shared';
import useCustomFetch from '../../hooks/customFetch.hook';
import { useNavigate, useParams } from 'react-router-dom';
import avatarReducer from './avatar.reducer';

export default function useAvatarPage() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const customFetch = useCustomFetch();
    const [avatars, avatarDataDispatch] = useReducer(avatarReducer, []);

    useEffect(() => {
        customFetch('avatar').then(res => {
            if (res) {
                avatarDataDispatch({type: 'setAvatars', avatars: res.body});
                const defAvatar = res.body.find((avatar: AvatarDto) => avatar.default);
                if (defAvatar) navigate('/avatar/' + defAvatar.id);
            }
        });
    }, []);

    const selectedAvatar = findAvatar();

    function findAvatar() {
        if (routeParams.avatarId) {
            if (routeParams.avatarId === 'new') return new AvatarDto();
            return avatars.find(avi => avi.id === routeParams.avatarId);
        }
        return undefined;
    }

    const selectedLayout = findLayout();

    function findLayout() {
        if (routeParams.avatarId && routeParams.layoutId) {
            return avatars.find(a => a.id === routeParams.avatarId)?.layouts.find(l => l.id === routeParams.layoutId);
        }
        return undefined;
    }

    const selectedButton = findButton();

    function findButton() {
        if (routeParams.avatarId && routeParams.layoutId && routeParams.buttonId) {
            if (routeParams.buttonId === 'new') return new ButtonDto();
            return avatars.find(a => a.id === routeParams.avatarId)?.layouts.find(l => l.id === routeParams.layoutId)?.buttons
                .find(b => b.id === routeParams.buttonId);
        }
        return undefined;
    }

    return {avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton};
}
