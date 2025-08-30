export default async function filterMessage(message) {
    const mentionRegex = /(@everyone|tele|status|@here|@([a-zA-Z0-9-_]+)|https?:\/\/[^\s]+)/;
    if (mentionRegex.test(message)) {
        return null;
    }
    return message;
}