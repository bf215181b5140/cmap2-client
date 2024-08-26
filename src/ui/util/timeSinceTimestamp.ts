export default function timeSinceTimestamp(timestamp: number | null, messagePrefix?: string, noTimestampMessage?: string): string {
    if (timestamp === null || timestamp === 0) return noTimestampMessage ?? '';

    const diff = (Date.now() - timestamp) / 1000;
    const message = messagePrefix ?? '';

    if (diff < 2) return message.concat('just now');
    if (diff < 60) return  message.concat(`${Math.floor(diff)} seconds ago`);
    if (diff < 120) return  message.concat(`over a minute ago`);
    if (diff < 3600) return  message.concat(`${Math.floor(diff / 60)} minutes ago`);
    return  message.concat(`${Math.floor(diff / 3600)} hours ago`);
}
