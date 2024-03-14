import { FieldOption } from 'cmap2-shared';

export default function enumToInputOptions(enumType: any): FieldOption[] {
    return Object.keys(enumType).map((key: string) => ({key: enumType[key], value: key}));
}
