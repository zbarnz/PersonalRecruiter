/***************************
 * 
 *        HTML
 * 
 **************************/


function stripHTMLTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

/***************************
 * 
 *        URLS
 * 
 **************************/

function isIqURL(url: string): boolean {
  console.log("is IQ?: " + url);
  //check if a url is a indeed  URL scheme
  // Regular expression to match the format 'iq://<some characters>'
  const pattern = /^iq:\/\/[^\s]+$/;
  return pattern.test(url);
}

function isIndeedApplyUrl(url: string) {
  return (
    url.startsWith("https://m5.apply.indeed.com") ||
    url.startsWith("https://smartapply.indeed.com")
  );
}

function standardizeIndeedApplyUrl(originalUrl: string): string {
  const regex = /^https:\/\/smartapply\.indeed\.com\/(.*)$/;
  const match = originalUrl.match(regex);

  if (match && match[1]) {
    return `https://m5.apply.indeed.com/${match[1]}`;
  }

  return originalUrl;
}

/***************************
 * 
 *        Datatypes
 * 
 **************************/


function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

function isValidArray(str: string): boolean {
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

/***************************
 * 
 *        Other
 * 
 **************************/


function sanitizeFilename(input: string): string {
  // Define a regex pattern for invalid filename characters
  // This includes \ / : * ? " < > |
  const invalidChars = /[\\/:*?"<>|]/g;

  // Replace invalid characters with an underscore
  return input.replace(invalidChars, "_");
}
