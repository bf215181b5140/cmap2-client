export const OscClockChatboxFormats = [
    {format: '{time}', description: 'Current time with hours, minutes and seconds.', func: (timestamp: Date, text: string) => {
        return text.replace('{time}', timestamp.toLocaleTimeString());
    }},
    {format: '{hour}', description: 'Current hour.', func: (timestamp: Date, text: string) => {
            return text.replace('{hour}', timestamp.getHours().toString());
        }},
    {format: '{minute}', description: 'Current minute.', func: (timestamp: Date, text: string) => {
            return text.replace('{minute}', timestamp.getMinutes.toString());
        }},
    {format: '{second}', description: 'Current second.', func: (timestamp: Date, text: string) => {
            return text.replace('{second}', timestamp.getSeconds().toString());
        }},
]

export default function oscClockChatboxText(text: string) {
    const time = new Date();
    OscClockChatboxFormats.forEach(format => {
        text = format.func(time, text);
    })
    return text;
}
