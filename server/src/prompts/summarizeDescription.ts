export function summarizeDescriptionPrompt(
  jobDescription: string,
  company: string
): string {
  const prompt = `Write a summary of the following job description. Try to include both information about the company and information about the job. Include all the specific requirements for the position. Do not include information about benefits / legal. Output should be AI readable.
  ###
  Company: ${company}
  
  ${jobDescription}
  ###`;

  return prompt;
}
