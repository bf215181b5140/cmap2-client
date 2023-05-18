
export interface VRChatOscParameterProperties {
    path: string;
}

export interface VRChatOscParameter {
    name: string;
    type: string;
    in: VRChatOscParameterProperties;
    out: VRChatOscParameterProperties;
}

export interface VRChatOscAvatar {
    name: string;
    id: string;
    parameters: VRChatOscParameter[];
}
