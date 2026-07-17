export function messageFilter(message: string) {
  const mentionRegex =
    /(@everyone|tele|status|@here|@([a-zA-Z0-9-_]+)|https?:\/\/\S+)/;
  if (mentionRegex.test(message)) return null;
  return message;
}
