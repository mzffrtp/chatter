function formatMessageTime(messageTime: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return messageTime.toLocaleDateString(undefined, options);
}

export default formatMessageTime;
