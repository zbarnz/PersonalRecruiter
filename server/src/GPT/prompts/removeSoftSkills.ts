export function removeSoftSkillsPrompt(
  skills: string[]
): string {
  const prompt = `Input is an array of technical skills. If array has soft skills, Return array with soft skills removed.

const array = [
${skills}
]

const newArray = `;

  return prompt;
}
