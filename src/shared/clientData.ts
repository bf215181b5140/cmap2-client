export interface ClientData {
    clientId: number;
    username: string;
    displayName: string;
    url: string;
    picture: string;  // url from server
    description: string;
    hidden: boolean;

    avatars: Avatar[];
}

export interface Avatar {
    avatarId: number;
    avatar: string;
    name: string;
    primary: boolean;
    order: number;
    layouts: Layout[];
}

export interface Layout {
    layoutId: number;
    name: string;
    order: number;
    buttons: Button[];
}

export interface Button {
    buttonId: number;
    label: string;
    key: string;
    value: string;
    type: string;
    image: string;  // url from server
    order: number;
}
