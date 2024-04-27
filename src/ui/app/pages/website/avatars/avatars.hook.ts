import { useEffect, useReducer, useState } from 'react';
import { AvatarDTO, AvatarPageDTO, ButtonDTO, ButtonImageOrientation, ButtonStyleDTO, ButtonType, LayoutDTO, ParameterValueType, TierDTO } from 'cmap2-shared';
import useCmapFetch from '../../../shared/hooks/cmapFetch.hook';
import { useNavigate, useParams } from 'react-router-dom';
import avatarsReducer from './avatars.reducer';
import { InteractionKeyDTO } from 'cmap2-shared/dist/types/InteractionKey';

export default function useAvatarPage() {

    const navigate = useNavigate();
    const routeParams = useParams();
    const customFetch = useCmapFetch();

    const [avatars, avatarDataDispatch] = useReducer(avatarsReducer, []);
    const [clientTier, setClientTier] = useState<TierDTO | null>(null);
    const [clientButtonStyle, setClientButtonStyle] = useState<ButtonStyleDTO | null>(null);
    const [interactionKeys, setInteractionKeys] = useState<InteractionKeyDTO[]>([]);

    const selectedAvatar = selectAvatar();
    const selectedLayout = selectedAvatar?.layouts?.find(l => l.id === routeParams.layoutId);
    const selectedButton = selectButton();

    function selectAvatar(): AvatarDTO | undefined {
        // new AvatarDTO for adding new avatar
        if (routeParams.avatarId === 'new') return { id: '', vrcId: '', label: '', default: false };
        // find avatar from route parameter
        if (routeParams.avatarId) return avatars.find(a => a.id === routeParams.avatarId);
        // find first default avatar or first avatar in array
        return avatars.find(a => a.default) || avatars[0];
    }

    function selectButton(): ButtonDTO | undefined {
        // new ButtonDTO for adding new button
        if (routeParams.buttonId === 'new') return {
            id: '',
            label: '',
            path: '',
            value: '',
            valueAlt: null,
            valueType: ParameterValueType.Int,
            buttonType: ButtonType.Button,
            imageOrientation: ButtonImageOrientation.Square,
            order: 0,
            useCost: null,
            image: null,
            controlParameter: null,
            interactionKey: null,
        };
        // find button from route parameter or undefined
        if (routeParams.buttonId) return selectedLayout?.buttons?.find(b => b.id === routeParams.buttonId);
    }

    useEffect(() => {
        customFetch<AvatarPageDTO>('avatar', {}, data => {
            avatarDataDispatch({ type: 'setAvatars', avatars: data.avatars });
            setClientTier(data.tier);
            setClientButtonStyle(data.buttonStyle);
            setInteractionKeys(data.interactionKeys);

            // Navigate to default or first avatar in list
            const defAvatar = data.avatars.find(a => a.default);
            if (defAvatar) {
                navigate('/website/avatars/' + defAvatar.id);
            } else if (data.avatars[0]?.id) {
                navigate('/website/avatars/' + data.avatars[0].id);
            }
        });
    }, []);

    return { avatars, avatarDataDispatch, selectedAvatar, selectedLayout, selectedButton, clientTier, clientButtonStyle, interactionKeys };
}
