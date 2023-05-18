import { ValueType } from 'cmap2-shared';

export interface VRChatOscAvatarParameterProperties {
    address: string;
    type: ValueType;
}

export interface VRChatOscAvatarParameter {
    name: string;
    input?: VRChatOscAvatarParameterProperties;
    output?: VRChatOscAvatarParameterProperties;
}

export interface VRChatOscAvatar {
    id: string;
    name: string;
    parameters: VRChatOscAvatarParameter[];
}
