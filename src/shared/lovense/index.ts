import { DeviceInformation, QRCodeData } from 'lovense';
import { z } from 'zod';
import { ValueType } from 'cmap2-shared';

export class LovenseSettings {
    sendConnectionOscMessage: boolean = false;
    connectionOscMessagePath: string = '';
}

export class LovenseStatus {
    socketConnection: boolean = false;
    status: number | null = null;
    qrCodeData: QRCodeData | null = null;
    deviceInformation: DeviceInformation | null = null;
}

export enum ToyActionType {
    All = 'All',
    Vibrate = 'Vibrate',
    Rotate = 'Rotate',
    Pump = 'Pump',
    Thrusting = 'Thrusting',
    Fingering = 'Fingering',
    Suction = 'Suction',
    Depth = 'Depth',
    Stop = 'Stop',
}

export const LovenseSettingsSchema = z.object({
    sendConnectionOscMessage: z.boolean(),
    connectionOscMessagePath: z.string(),
});

export const ToyCommandParameterSchema = z.object({
    parameterPath: z.string(),
    action: z.nativeEnum(ToyActionType),
    timeSec: z.number().min(0),
    toy: z.string(),
});
export type ToyCommandParameter = z.infer<typeof ToyCommandParameterSchema>;

export const ToyCommandParameterFormSchema = z.object({
    toyCommandParameters: z.array(ToyCommandParameterSchema),
});
export type ToyCommandParameterForm = z.infer<typeof ToyCommandParameterFormSchema>;

export const ToyCommandOscMessageSchema = z.object({
    toy: z.string(),
    parameterPath: z.string(),
    valueType: z.nativeEnum(ValueType),
});
export type ToyCommandOscMessage = z.infer<typeof ToyCommandOscMessageSchema>;

export const ToyCommandOscMessageFormSchema = z.object({
    toyCommandOscMessages: z.array(ToyCommandOscMessageSchema),
});
export type ToyCommandOscMessageForm = z.infer<typeof ToyCommandOscMessageFormSchema>;
