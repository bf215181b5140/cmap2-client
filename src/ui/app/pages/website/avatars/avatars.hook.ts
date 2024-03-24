import { useEffect, useReducer, useState } from 'react';
import { AvatarDTO, Avatars, ButtonDto, ButtonStyleDto, LayoutDto, TierDTO } from 'cmap2-shared';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';
import { useNavigate, useParams } from 'react-router-dom';
import avatarsReducer from './avatars.reducer';

export default function useAvatarPage() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const customFetch = useCmapFetch();
    const [avatars, avatarDataDispatch] = useReducer(avatarsReducer, []);
    const [clientTier, setClientTier] = useState<TierDTO>(new TierDTO());
    const [clientButtonStyle, setClientButtonStyle] = useState<ButtonStyleDto>(new ButtonStyleDto());
    const [selectedAvatar, setAvatar] = useState<AvatarDTO | undefined>(undefined);
    const [selectedLayout, setLayout] = useState<LayoutDto | undefined>(undefined);
    const [selectedButton, setButton] = useState<ButtonDto | undefined>(undefined);

    useEffect(() => {
        customFetch<Avatars>('avatar', {}, data => {
            avatarDataDispatch({type: 'setAvatars', avatars: data.avatars});
            setClientTier(data.tier);
            setClientButtonStyle(data.buttonStyle);
            setDefaultOrFirstAvatar(data.avatars);
        });
    }, []);

    function setDefaultOrFirstAvatar(list?: AvatarDTO[]) {
        const tempList = list ? list : avatars;
        if (tempList) {
            const tempAvatar = tempList.find((avatar: AvatarDTO) => avatar.default);
            if (tempAvatar) {
                navigate('/website/avatars/' + tempAvatar.id);
            } else if (tempList[0]?.id) {
                navigate('/website/avatars/' + tempList[0].id);
            }
        }
    }

    useEffect(() => {
        if (routeParams.avatarId) {
            if (routeParams.avatarId === 'new') {
                setAvatar(new AvatarDTO());
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
