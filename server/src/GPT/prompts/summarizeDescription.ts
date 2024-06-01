export function summarizeDescriptionPrompt(
  jobDescription: string,
  company: string
): string {
  const prompt = `Write a short one or two paragraph summary of the following job description. Try to include both information about the company and information about the job. Omit information about benefits / legal. Output should be AI readable.
  ###
  Company: ${company}
  
  ${jobDescription}
  ###`;

  return prompt;
}
