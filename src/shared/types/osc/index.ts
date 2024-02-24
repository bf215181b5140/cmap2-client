export interface OscSettings {
    oscIp: string;
    oscInPort: number;
    oscOutPort: number;
}

export interface VrcOscData {
    avatars: VrcOscAvatar[];
}

export interface VrcOscAvatar {
    id: string;
    name: string;
    parameters: VrcOscAvatarParameter[];
}

export interface VrcOscAvatarParameter {
    name: string;
    input?: VrcOscAvatarParameterProperties;
    output?: VrcOscAvatarParameterProperties;
}

export interface VrcOscAvatarParameterProperties {
  address: string;
  type: 'Int' | 'Float' | 'Bool';
}
