export const utcToUnix = (utcString: string): number => {
  const dateObj = new Date(utcString);
  const unixTimestampMillis = dateObj.getTime();
  return Math.floor(unixTimestampMillis / 1000);
};

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}