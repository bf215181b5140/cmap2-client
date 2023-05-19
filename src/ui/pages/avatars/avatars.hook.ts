import { useEffect, useReducer, useState } from 'react';
import { AvatarDto, Avatars, ButtonDto, ButtonStyleDto, LayoutDto, TierDto } from 'cmap2-shared';
import useCustomFetch from '../../shared/hooks/customFetch.hook';
import { useNavigate, useParams } from 'react-router-dom';
import avatarsReducer from './avatars.reducer';

export default function useAvatarPage() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const customFetch = useCustomFetch();
    const [avatars, avatarDataDispatch] = useReducer(avatarsReducer, []);
    const [clientTier, setClientTier] = useState<TierDto>(new TierDto());
    const [clientButtonStyle, setClientButtonStyle] = useState<ButtonStyleDto>(new ButtonStyleDto());
    const [selectedAvatar, setAvatar] = useState<AvatarDto | undefined>(undefined);
    const [selectedLayout, setLayout] = useState<LayoutDto | undefined>(undefined);
    const [selectedButton, setButton] = useState<ButtonDto | undefined>(undefined);

    useEffect(() => {
        customFetch<Avatars>('avatar').then(res => {
            if (res?.body) {
                avatarDataDispatch({type: 'setAvatars', avatars: res.body.avatars});
                setClientTier(res.body.tier);
                setClientButtonStyle(res.body.buttonStyle);
                setDefaultOrFirstAvatar(res.body.avatars);
            }
        });
    }, []);

    function setDefaultOrFirstAvatar(list?: AvatarDto[]) {
        const tempList = list ? list : avatars;
        if (tempList) {
            const tempAvatar = tempList.find((avatar: AvatarDto) => avatar.default);
            if (tempAvatar) {
                navigate('/avatars/' + tempAvatar.id);
            } else if (tempList[0]?.id) {
                navigate('/avatars/' + tempList[0].id);
            }
        }
    }

    useEffect(() => {
        if (routeParams.avatarId) {
            if (routeParams.avatarId === 'new') {
                setAvatar(new AvatarDto());
            } else {
                setAvatar(avatars.find(avi => avi.id === routeParams.avatarId));
            }
        } else {
            setDefaultOrFirstAvatar();
        }
        if (routeParams.avatarId && routeParams.layoutId) {
            setLayout(avatars.find(a => a.id === routeParams.avatarId)?.layouts?.find(l => l.id === routeParams.layoutId));
        } else {
            setLayout(undefined);
        }
        if (routeParams.avatarId && routeParams.layoutId && routeParams.buttonId) {
            if (routeParams.buttonId === 'new') {
                setButton(new ButtonDto());
            } else {
                setButton(avatars.find(a => a.id === routeParams.avatarId)?.layouts?.find(l => l.id === routeParams.layoutId)?.buttons
                    ?.find(b => b.id === routeParams.buttonId));
            }
        } else {
            setButton(undefined);
        }
    }, [routeParams]);

    return {avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton, clientTier, clientButtonStyle};
}
