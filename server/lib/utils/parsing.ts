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

function levenshteinDistance(s1: string, s2: string): number {
  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[s2.length][s1.length];
}

export function calculateStringSimilarity(s1: string, s2: string): number {
  if (s1.length === 0 || s2.length === 0) return 0;
  const distance = levenshteinDistance(s1, s2);
  return 1.0 - distance / Math.max(s1.length, s2.length);
}
