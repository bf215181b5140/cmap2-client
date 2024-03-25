import { useEffect, useReducer, useState } from 'react';
import { AvatarDTO, AvatarPageDTO, ButtonDTO, ButtonImageOrientation, ButtonStyleDTO, ButtonType, LayoutDTO, ParameterValueType, TierDTO } from 'cmap2-shared';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';
import { useNavigate, useParams } from 'react-router-dom';
import avatarsReducer from './avatars.reducer';

export default function useAvatarPage() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const customFetch = useCmapFetch();
    const [avatars, avatarDataDispatch] = useReducer(avatarsReducer, []);
    const [clientTier, setClientTier] = useState<TierDTO | null>(null);
    const [clientButtonStyle, setClientButtonStyle] = useState<ButtonStyleDTO | null>(null);
    const [selectedAvatar, setAvatar] = useState<AvatarDTO | undefined>(undefined);
    const [selectedLayout, setLayout] = useState<LayoutDTO | undefined>(undefined);
    const [selectedButton, setButton] = useState<ButtonDTO | undefined>(undefined);

    useEffect(() => {
        customFetch<AvatarPageDTO>('avatar', {}, data => {
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
                setAvatar({
                    default: false,
                    id: '',
                    label: '',
                    vrcId: ''
                });
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
                setButton({
                    buttonType: ButtonType.Button,
                    id: '',
                    image: null,
                    imageOrientation: ButtonImageOrientation.Square,
                    label: '',
                    order: 0,
                    path: '',
                    useCost: null,
                    value: '',
                    valueAlt: null,
                    valueType: ParameterValueType.Int
                });
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
