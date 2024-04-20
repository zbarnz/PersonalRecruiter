export function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

//epic comments below
export function isValidArray(str: string): boolean {
  try {
    // Try to parse the string as JSON
    const parsed = JSON.parse(str);

    // Check if the parsed result is an array
    return Array.isArray(parsed);
  } catch (e) {
    // If an error occurs during parsing, it's not a valid array string
    return false;
  }
}

export function sanitizeFilename(input: string): string {
  // Define a regex pattern for invalid filename characters
  // This includes \ / : * ? " < > |
  const invalidChars = /[\\/:*?"<>|]/g;

  // Replace invalid characters with an underscore
  return input.replace(invalidChars, "_");
}
