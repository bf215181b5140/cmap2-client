export const OscClockChatboxFormats = [
    {
        format: '{time}',
        description: 'Current time with hours and minutes.',
        func: (timestamp: Date, text: string) => {
            return text.replace('{time}', timestamp.getHours().toString().padStart(2, '0') + ':' + timestamp.getMinutes().toString().padStart(2, '0'));
        }
    },
    {
        format: '{hour}',
        description: 'Current hour.',
        func: (timestamp: Date, text: string) => {
            return text.replace('{hour}', timestamp.getHours().toString());
        }
    },
    {
        format: '{minute}',
        description: 'Current minute.',
        func: (timestamp: Date, text: string) => {
            return text.replace('{minute}', timestamp.getMinutes().toString());
        }
    },
];

export default function oscClockChatboxText(text: string) {
    const time = new Date();
    OscClockChatboxFormats.forEach(format => {
        text = format.func(time, text);
    });
    return text;
}
